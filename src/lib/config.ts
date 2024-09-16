import type {
  FeatureWithID,
  Schemes,
  SchemeData,
  FeatureProps,
} from "$lib/draw/types";
import type { Feature, LineString, Polygon, Point } from "geojson";
import { get, writable, type Writable } from "svelte/store";
import { SvelteComponent, type ComponentType } from "svelte";
import type { Map } from "maplibre-gl";

// TODO Still do this, or use something else?
export let map: Writable<Map | null> = writable(null);
export let sidebarDiv: Writable<HTMLDivElement | null> = writable(null);

// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.
// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things
export interface Config<F, S> {
  interventionName: (f: FeatureWithID<F>) => string;

  schemeName: (s: SchemeData & S) => string;

  backfill: (json: any) => Schemes<F, S>;

  initializeEmptyScheme: (scheme: SchemeData) => SchemeData & S;

  interventionWarning: (feature: FeatureWithID<F>) => string | null;

  editFeatureForm: null | ComponentType<
    SvelteComponent<{
      cfg: Config<F, S>;
      gjSchemes: Writable<Schemes<F, S>>;
      id: number;
      props: FeatureProps<F>;
    }>
  >;

  editSchemeForm: null | ComponentType<
    SvelteComponent<{
      gjSchemes: Writable<Schemes<F, S>>;
      scheme_reference: string;
    }>
  >;

  // Should assign any necessary properties. Runs inside a gjSchemes
  // update; the logic shouldn't look at anything in there.
  newPointFeature: (f: FeatureWithID<F, Point>) => void;
  newPolygonFeature: (f: FeatureWithID<F, Polygon>) => void;
  newLineStringFeature: (f: FeatureWithID<F, LineString>) => void;

  updateFeature: (
    destination: FeatureWithID<F>,
    source: FeatureWithID<F>,
  ) => void;

  // Required for the geocoder in the route mote to work
  maptilerApiKey: string;

  // When the StreetView tool is activated, line layers with these IDs will be
  // highlighted. This depends on the basemap.
  getStreetViewRoadLayerNames: (map: Map) => string[];

  // All layer IDs used with layerId must be defined here, with later entries
  // drawn on top. Components with layers can't be initialized until this
  // is set. It's not reactive; set it up once at the start.
  layerZorder: string[];
}
