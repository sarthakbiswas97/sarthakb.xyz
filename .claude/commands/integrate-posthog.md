# Integrate PostHog Analytics in a Next.js App Router Project

You are an expert Next.js and analytics engineer. Integrate PostHog analytics into the current Next.js App Router project following production-grade patterns. Use `@posthog/next` — the official PostHog Next.js SDK.

## Pre-flight

1. Check if PostHog is already integrated (search for `posthog` in `package.json`, `layout.tsx`, `next.config.ts`). If already present, inform the user and stop.
2. Confirm the project uses Next.js App Router (check for `app/layout.tsx`). If using Pages Router, warn the user that this skill targets App Router only.

## Step 1: Install the package

```bash
bun add @posthog/next
```

This single package includes both `posthog-js` (client) and `posthog-node` (server) as dependencies. Do not install them separately.

## Step 2: Environment variables

Add to `.env.local` (create if missing):

```env
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

If `.env.example` exists, add the keys there too (without values) for documentation:

```env
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

Notes:
- The API key starts with `phc_` and is found in PostHog → Project Settings → Project API Key.
- Use `https://eu.i.posthog.com` for EU-hosted projects.
- The `NEXT_PUBLIC_` prefix is required — these are client-side values (the API key is a public, non-secret write-only key).

## Step 3: Reverse proxy via Next.js rewrites

In `next.config.ts`, add rewrites to proxy PostHog requests through the app's own domain. This avoids ad blockers and CORS issues.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // ... existing config
};
```

If rewrites already exist, merge these entries into the existing array. If the project uses EU hosting, replace `us.i.posthog.com` with `eu.i.posthog.com` and `us-assets.i.posthog.com` with `eu-assets.i.posthog.com`.

**Important:** The `/ingest/static/:path*` rule MUST come before the catch-all `/ingest/:path*` rule — Next.js rewrites are matched in order.

## Step 4: Provider setup in root layout

Modify `app/layout.tsx`:

1. Add imports:
```typescript
import { PostHogProvider, PostHogPageView } from "@posthog/next";
import { Suspense } from "react";
```

2. Wrap the `<body>` content with `PostHogProvider` and add `PostHogPageView`:
```tsx
<body>
  <PostHogProvider clientOptions={{ api_host: "/ingest" }}>
    {/* existing providers/content */}
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
    {/* rest of the app */}
  </PostHogProvider>
</body>
```

Key details:
- `PostHogProvider` should be the **outermost** provider wrapping all content in `<body>`.
- `clientOptions={{ api_host: "/ingest" }}` routes requests through the reverse proxy configured in Step 3.
- `PostHogPageView` MUST be wrapped in `<Suspense>` because it uses `useSearchParams()` internally, which requires a Suspense boundary in Next.js App Router.
- The SDK reads `NEXT_PUBLIC_POSTHOG_KEY` automatically — no need to pass `apiKey` as a prop.
- `PostHogPageView` disables the default `posthog-js` auto-pageview and instead tracks page views on Next.js client-side navigations using `usePathname()` and `useSearchParams()`.

## Step 5: Verify the integration

After setup, tell the user:
- Start the dev server and open the browser DevTools Network tab.
- Look for requests to `/ingest/e` — these are PostHog event batches.
- Check the PostHog dashboard → Activity → Live Events to see pageviews arriving.
- Navigate between pages to confirm client-side navigation triggers new `$pageview` events.

## Optional: Custom event tracking

If the user wants to track custom events, show this pattern:

```typescript
"use client";
import { usePostHog } from "@posthog/next";

function MyComponent() {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture("button_clicked", {
      button_name: "cta_hero",
      page: "/landing",
    });
  };

  return <button onClick={handleClick}>Get Started</button>;
}
```

## Optional: Feature flags

If the user wants feature flags:

```typescript
"use client";
import { useFeatureFlag } from "@posthog/next";

function MyComponent() {
  const showNewUI = useFeatureFlag("new-dashboard-ui");

  if (showNewUI) {
    return <NewDashboard />;
  }
  return <OldDashboard />;
}
```

For server-side flag evaluation (bootstrapping flags to avoid flicker), add `bootstrapFlags` to the provider:

```tsx
<PostHogProvider
  clientOptions={{ api_host: "/ingest" }}
  bootstrapFlags={true}
>
```

This makes the provider call `cookies()` and `headers()` to identify the user server-side — it opts the layout out of static rendering.

## Architecture summary

```
Browser → /ingest/* (first-party request)
  ↓ Next.js rewrites (next.config.ts)
PostHog US/EU endpoint

App Router component tree:
  RootLayout (Server Component)
    └─ PostHogProvider (reads env, initializes SDK)
        └─ PostHogPageView (Client Component, in Suspense)
            └─ Tracks $pageview on pathname/search changes
        └─ Rest of app (can use usePostHog() anywhere)
```

## Checklist before finishing

- [ ] `@posthog/next` is in `package.json`
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are in `.env.local`
- [ ] Rewrites are in `next.config.ts` (static assets rule before catch-all)
- [ ] `PostHogProvider` wraps body content in `app/layout.tsx` with `api_host: "/ingest"`
- [ ] `PostHogPageView` is inside a `<Suspense>` boundary
- [ ] No duplicate `posthog-js` or `posthog-node` manual installs
- [ ] `.env.local` is in `.gitignore`
