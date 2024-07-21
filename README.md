# Scheme Sketcher library

NOTE: This repo isn't ready for use yet. It's currently being refactored from <https://github.com/acteng/atip>.

This is a library for building Svelte web apps to edit GeoJSON files with MapLibre. It includes:

- a toolbox for drawing points, linestrings, and polygons, optionally [snapping to a network](https://github.com/dabreegster/route_snapper/)
- state management -- GeoJSON is autosaved to local storage, with filesystem download and upload. General undo support is planned.
- layers -- objects can be grouped into distinct layers, moved around, hidden, etc

This library is higher-level than collections of drawing tools, such as [mapbox-gl-draw](https://github.com/mapbox/mapbox-gl-draw) and [terra-draw](https://github.com/JamesLMilner/terra-draw). If you want individual tools, see [route_snapper](https://github.com/dabreegster/route_snapper/) and [maplibre-draw-polygon](https://github.com/dabreegster/maplibre-draw-polygon). If you don't want opinionated state management and layers, then don't use this.

## Design choices / non-goals

- There are assumptions about how this library is used -- like there's only one set of controls instantiated per page, so singletons in Svelte stores are fine.
- Controls are styled using the [GOV.UK Design System](https://design-system.service.gov.uk/). This isn't planned to be configurable yet.
- Map styling is also hardcoded here.
  - Improvements to components should be made here and compatible with the few planned users. When users need more control, we'll explore tradeoffs between copying a bit of code and making things configurabl here. Making _everything_ configurable adds lots of complexity, so won't be a first choice.

## Setup

TODO: Document all of these

- setting things in config
  - map store
  - ownership of gjSchemeCollection and initialization gotchas
- govuk
- static assets
- z-order
- making forms and designing a schema
- mapStyle
- maybe change UserSettings local storage sync / key

## Immediate TODOs

- upgrade packages
- consider renaming "intervention" and "scheme"

## Current users

- [England](https://github.com/acteng/atip/)
- [Scotland](https://github.com/nptscot/scheme-sketcher/)

## Developer guide

This is a fairly standard Sveltekit project. `src/lib` is the library meant for use by others, and `src/routes` is a demo site using it. `npm i`, then `npm run dev` to develop locally.
