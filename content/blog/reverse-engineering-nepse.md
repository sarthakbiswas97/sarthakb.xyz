---
title: "reverse-engineering nepse api"
excerpt: "building a python sdk for nepal's undocumented stock exchange api"
date: "march 22, 2026"
tags:
  - python
  - reverse-engineering
  - open-source
  - nepal
  - sdk
---

nepal's stock exchange website ([nepalstock.com](https://nepalstock.com)) doesn't have a public api. if you want market data programmatically, you're on your own. the site is an angular frontend backed by a spring boot rest api. completely undocumented, and as we'd soon find out, actively hostile to anyone trying to use it outside a browser.

we reverse-engineered the whole thing and published it as [`nepse-sdk`](https://pypi.org/project/nepse-sdk/) on pypi. here's everything that went wrong along the way.

the source code is on [github](https://github.com/lagani-org/nepse-sdk/).

---

## the tokens are broken on purpose

the first thing you need to do is authenticate. there's no api key, no oauth. you hit `GET /api/authenticate/prove` and get back a pair of jwe tokens along with five integers called `salt1` through `salt5`.

simple enough. we grabbed the access token, stuck it in an auth header, called a data endpoint. 500 error. invalid jwe header.

we decoded the token's base64url header and compared it to what a valid jwe header should look like. there were extra characters shoved into the token at seemingly random positions. the api is literally sending you broken tokens. on purpose.

this is their anti-scraping measure. the frontend knows how to fix the tokens. anyone else gets garbage.

## a wasm file called css.wasm

we started digging through the minified angular frontend to figure out how the browser reconstructs valid tokens. the logic isn't in javascript. it calls into a webassembly module that the frontend downloads from `/assets/prod/css.wasm`.

yes, they named a webassembly binary `css.wasm`. presumably so it blends in with the other static assets. sneaky.

this module is tiny, only 750 bytes, and exports five functions with cryptic names: `cdx`, `rdx`, `bdx`, `ndx`, `mdx`. each one takes the five salt integers and returns a single number: the index of a junk character in the token. call all five, remove the characters at those positions (in descending order so the indices don't shift), and you get a valid token.

rather than trying to decompile the wasm into arithmetic and hardcoding formulas, we just run the actual binary using `wasmtime`. if nepse ever changes the math, the sdk re-downloads the module and adapts automatically. the binary is 750 bytes. it's fine.

one thing that tripped us up early: we passed an import object to the `wasmtime.Instance` constructor, which is the standard pattern for wasm modules that need host functions. this module needs nothing. zero imports. wasmtime threw `expected 0 imports, found 1` and we stared at it for longer than we'd like to admit before realizing the fix was just passing an empty list.

## the salt ordering is different for every function and every token

this part was genuinely tedious. the five wasm functions don't all receive the salts in the same order. and the ordering is different for the access token vs the refresh token. we had to trace through minified javascript with variable names like `a`, `b`, `c`, `d`, `e` to extract the exact argument permutations.

for the access token, `cdx` gets `(s1, s2, s3, s4, s5)` but `rdx` gets `(s1, s2, s4, s3, s5)` where s3 and s4 are swapped. for the refresh token, `cdx` gets `(s2, s1, s3, s5, s4)` with s1/s2 swapped and s4/s5 swapped. every function has its own special ordering for each token type. ten permutations total.

get any single one wrong and the token is still corrupted. we verified each ordering by decoding the cleaned token's header and checking it against the expected `{"enc":"A128CBC-HS256","alg":"dir"}`. it was a lot of trial and error.

## salter, not bearer

after all that work cleaning the tokens, we put the access token in an `Authorization: Bearer` header like a normal api. still didn't work.

nepse uses a custom authorization scheme called `Salter`. not bearer, not basic. just `Salter` followed by a space and the token. we found this in the angular http interceptor. no idea why they invented their own scheme. maybe another layer of "if you don't know, you can't use it."

## the response shapes in the frontend code are wrong

this one was fun. we looked at the angular frontend to figure out the shape of the security detail response. the code references a field called `securityDailyTradeDto`. we built our types around that. then we hit the actual api:

```
KeyError: 'securityDailyTradeDto'
```

the real response uses `securityMcsData`. the frontend source code and the live api don't agree on field names. maybe the code was updated and the api wasn't, or vice versa. either way, the lesson was: don't trust the frontend code, test against the live api.

## ssl certs and uv's python

this was a stupid one. we're using `uv` as the package manager, which installs its own standalone python. that python ships its own certificate bundle via `certifi`, and it couldn't verify nepalstock.com's certificate chain. `curl` worked fine from the same machine. the system cert store was fine. but uv's python disagreed.

we set `verify=False` on the `httpx` client. it's a scraper hitting one known host — not great practice, but not worth fighting uv's cert handling over.

## getting the types right

early on, we had `dict[str, Any]` scattered everywhere for api responses. it worked, but what's the point of an sdk if the user has to guess what fields exist?

we tried `dict[str, object]` which is technically more correct but equally useless in practice. the user still has no idea what's in the dict without reading the source.

the solution we landed on is a two-layer type system. the first layer is `TypedDict` classes that mirror the raw api json exactly with camelcase keys, nested structures, matching the wire format. the second layer is `@dataclass` classes with pythonic snake_case names, which is what the sdk consumer actually touches.

the client does `typing.cast` at the json boundary (telling mypy "this json conforms to this typeddict") and maps fields explicitly in the dataclass constructors. the whole codebase passes `mypy --strict` with zero errors. no `Any` anywhere.

## publishing as nepse-sdk, importing as nepse

we wanted `pip install nepse-sdk` but `from nepse import NepseClient`. distribution name and import name are different, and the build tool needs to know.

`uv_build` auto-maps `nepse-sdk` to `nepse_sdk` and looks for `src/nepse_sdk/`. our package is `src/nepse/`. build failed. the fix is one config line:

```toml
[tool.uv.build-backend]
module-name = "nepse"
```

we also had the toml key wrong initially. `[tool.uv-build]` instead of `[tool.uv.build-backend]`. subtle difference, no error message, just silently ignored. good times.

---

## how it all fits together

the auth flow works like this: on first use, the client hits the auth endpoint, cleans the tokens via wasm, and caches them to disk at `~/.lagani/nepseweb/.auth`. on subsequent runs, it loads the cached tokens. if a request gets a 401, it tries to refresh. if the refresh fails, it does a full re-auth from scratch. the user never has to think about any of this.

the sdk exposes typed methods for market summaries, top gainers/losers, security details, dividend history, and the full securities list. there's also a cli built with `click` for quick terminal lookups. everything is on [pypi](https://pypi.org/project/nepse-sdk/).

the stack is python 3.13, `httpx` for http, `wasmtime` for the wasm runtime, and `click` for the cli. the codebase is about 400 lines of actual logic across seven files.

if you're interested in the code or want to contribute more endpoints, the whole thing is [open source](https://github.com/lagani-org/nepse-sdk/).
