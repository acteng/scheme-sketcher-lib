# Scheme Sketcher

NOTE: This repo isn't ready for use yet.

This is a collection of components for drawing and editing objects with MapLibre.

## Goals / non-goals

- Map styling is hardcoded here. If there are improvements to any app using this library, they should be made here and benefit all uses. If there's something particular to one use, then they can either copy the component and modify accordingly, or we can carefully consider making it configurable here. Making everything configurable adds lots of complexity, so won't be a first choice.
- There are assumptions about how this library is used -- like there's only one set of controls instantiated per page, so singletons in Svelte stores are fine.

## Setup

- govuk
- static assets
- z-order
