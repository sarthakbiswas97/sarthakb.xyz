---
title: "immersive map representation of nepal"
excerpt: "nepal's provinces, district, municipality and constituency visualization"
date: "feb 11, 2026"
tags:
  - data-visualization
  - maps
  - d3
  - geojson
  - nepal
---

nepal has 165 parliamentary constituencies, 77 districts, 7 provinces, and 754 municipalities. i wanted to see all of it on one map. nothing like that existed, so i built it.

you can check it out at [electionatlas.ankurgajurel.com.np/immersive](https://electionatlas.ankurgajurel.com.np/immersive).

## data sources

**constituency boundaries**: [akashadhikari/eon_election_analysis](https://github.com/akashadhikari/eon_election_analysis). geojson with all 165 constituency polygons + election result csvs from 2079 bs with victory margins and party winners.

**municipality boundaries**: [younginnovations/nepal-locallevel-map](https://github.com/younginnovations/nepal-locallevel-map). simplified geojson of all 754 municipalities. no constituency field, so i had to join them later.

**candidate data**: [ratemyneta.com](https://ratemyneta.com/) rest api. provinces, districts, constituencies, candidates with names, photos, party affiliations, vote counts. 3,405 candidates total. scraped with local file caching and 200ms delay between requests.

**dead ends**: [mesaugat/geoJSON-Nepal](https://github.com/mesaugat/geoJSON-Nepal), [okfnepal/localboundaries](https://github.com/okfnepal/localboundaries), nepal national geoportal, humanitarian data exchange. outdated boundaries or wrong admin levels. [ekantipur's election map](https://election.ekantipur.com/) was useful for design reference.

## data pipeline

all node scripts in `scripts/`. zero runtime backend, all static json output.

- **geojson to topojson**: raw constituency geojson was 25mb. simplified (3% quantile) + quantized with `topojson-server`, `topojson-simplify`, `topojson-client`. result: ~1mb.
- **national parks**: original data had all parks as one multipolygon. split into 13 individual features and labeled manually.
- **nepali-english mapping**: election results in nepali, geojson in english. wrote a 77-entry district mapping table by hand.
- **municipality-constituency join**: single-constituency districts are a trivial lookup. multi-constituency districts (kathmandu has 10) used `@turf/boolean-point-in-polygon` to test each municipality centroid against constituency polygons.
- **candidate splitting**: bulk `candidates.json` split into 167 individual files so each constituency page loads only its own data.

## stack

next.js 16, react 19, d3.js 7, topojson, tailwind css 4, shadcn/ui.

## the main map

d3 svg map with `geoMercator` projection, `d3-zoom` for pan/zoom, three color modes (party winners, province colors, victory margin gradient). click a constituency to see all candidates with photos, party symbols, and vote counts in a side panel. municipality boundaries rendered as a zoom-gated layer, interactive only past 2x zoom.

## the immersive view

full-screen dark map with progressive drill-down. `useReducer` state machine:

```
country (7 colored provinces)
  > click province > province (districts as color shades)
    > click district > district (municipality outlines)
```

back button, escape key, and breadcrumb navigation to go up levels. "view constituencies" toggle at province/district level.

**single projection, zoom transforms only.** mercator projection computed once to fit the country. navigation uses `d3.transition().duration(800).ease(d3.easeCubicInOut)` with transforms computed from `pathGenerator.bounds()`. no projection recomputation.

**province and district polygons derived on the fly.** `topojson.merge(topology, geometries.filter(STATE === "Bagmati"))` merges constituency geometries into province/district shapes. zero extra data files.

**constituency overlay** uses `topojson.mesh()` for clean internal boundaries (each shared edge drawn once). each constituency gets a distinct color via hsl hue rotation from the province base color.

**national parks** rendered with diagonal svg hatching patterns, hover glow effects, area-gated labels.

## label sizing

labels on maps are hard. fixed font sizes break at different zoom levels. `fontSize / zoomLevel` makes all areas look the same. scaling to polygon width breaks because svg units don't change with zoom.

final solution: compute the polygon's screen pixel width, calculate target font size as a clamped percentage, convert back to svg units. `targetPx = clamp(screenWidth * 0.12, min, max)`, `svgFontSize = targetPx / zoomLevel`. area-gated rendering for dense municipality labels. all labels use an svg filter (`feGaussianBlur` + `feColorMatrix`) for a dark halo behind white text.

## gotchas

- **pointer events**: constituency overlay with `pointerEvents="fill"` blocked clicks to districts underneath. fix: `pointerEvents="none"` on overlay.
- **district name casing**: constituencies use `"KATHMANDU"`, municipalities use `"Kathmandu"`. normalize to uppercase.
- **province numbers vs names**: municipalities use `province: 3`, constituencies use `STATE: "Bagmati"`. bridging map required.

## numbers

- 165 constituencies, 77 districts, 7 provinces, 754 municipalities, 13 national parks
- 3,405 candidates with photos and party data
- ~1.7mb total static data
- zero runtime api calls
