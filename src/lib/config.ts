import type {
  FeatureWithAnyProps,
  FeatureWithID,
  SchemeCollection,
  SchemeData,
} from "$lib/draw/types";
import type { Feature, LineString, Polygon, Point } from "geojson";
import { get, writable, type Writable } from "svelte/store";
import { SvelteComponent, type ComponentType } from "svelte";
import type { Map } from "maplibre-gl";

export let map: Writable<Map | null> = writable(null);

// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.

// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things

export let cfg = {
  interventionName: (f: FeatureWithAnyProps) => {
    return `some ${f.geometry.type} feature`;
  },

  schemeName: (s: SchemeData) => {
    return `scheme ${s.scheme_reference}`;
  },

  backfill: (json: any) => {
    return json as SchemeCollection;
  },

  initializeEmptyScheme: (scheme: SchemeData) => {},

  interventionWarning: (feature: FeatureWithAnyProps) => {
    return null;
  },

  editFeatureForm: null as null | ComponentType<
    SvelteComponent<{
      id: number;
      props: { [name: string]: any };
    }>
  >,

  editSchemeForm: null as null | ComponentType<
    SvelteComponent<{
      scheme_reference: string;
    }>
  >,

  // Should assign any necessary properties. Runs inside a gjSchemeCollection
  // update; the logic shouldn't look at anything in there.
  newPointFeature: (f: FeatureWithID<Point>) => {},
  newPolygonFeature: (f: FeatureWithID<Polygon>) => {},
  newLineStringFeature: (f: FeatureWithID<LineString>) => {},

  updateFeature: (
    destination: FeatureWithAnyProps,
    source: FeatureWithAnyProps,
  ) => {
    // Don't do anything by default
  },

  // Required for the geocoder in the route mote to work
  maptilerApiKey: "",

  // When the StreetView tool is activated, line layers with these IDs will be
  // highlighted. This depends on the basemap.
  getStreetViewRoadLayerNames: (map: Map) => [] as string[],

  // All layer IDs used with layerId must be defined here, with later entries
  // drawn on top. These entries cover everything used by this library.
  layerZorder: [
    // Polygons are bigger than lines, which're bigger than points. When geometry
    // overlaps, put the smaller thing on top
    "interventions-coverage-polygons-outlines",
    "interventions-polygons",
    "interventions-polygons-outlines",
    // This is an outline, so draw on top
    "hover-polygons",

    // The hover effect thickens, so draw beneath
    "hover-lines",
    "interventions-lines",
    "interventions-lines-endpoints",

    "hover-points",
    "interventions-points",

    "edit-polygon-fill",
    "edit-polygon-lines",
    "edit-polygon-vertices",

    "draw-split-route",

    "route-points",
    "route-lines",
    "route-polygons",

    // TODO Move this to the sveltekit demo app. It assumes a basemap.
    "road_label",

    // Draw the inverted boundary fade on top of basemap labels
    "boundary",

    // TODO This might look nicer lower
    "georeferenced-image",
  ],
};
