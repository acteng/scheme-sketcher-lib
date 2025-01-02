import type {
  FeatureProps,
  FeatureWithID,
  SchemeData,
  Schemes,
} from "$lib/draw/types";
import type { Feature, LineString, Point, Polygon } from "geojson";
import type { Map } from "maplibre-gl";
import { SvelteComponent, type ComponentType } from "svelte";
import { get, writable, type Writable } from "svelte/store";

// TODO Still do this, or use something else?
export let map: Writable<Map | null> = writable(null);

// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.
// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things
export interface Config<F, S> {
  interventionName: (f: FeatureWithID<F>) => string;

  schemeName: (s: SchemeData & S) => string;

  backfill: (json: any) => Schemes<F, S>;

  initializeEmptyScheme: (scheme: SchemeData) => SchemeData & S;

  interventionWarning: (props: FeatureProps<F>) => string | null;

  // When id is null, a new feature is being created
  editFeatureForm: null | ComponentType<
    SvelteComponent<{
      cfg: Config<F, S>;
      gjSchemes: Writable<Schemes<F, S>>;
      id: number | null;
      props: FeatureProps<F>;
    }>
  >;

  // This component will only be instantiated when the user opens the modal to
  // edit the scheme, so it can rely on onDestroy to finalize any
  // changes.
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

  // When the StreetView tool is activated, line layers with these IDs will be
  // highlighted. This depends on the basemap.
  getStreetViewRoadLayerNames: (map: Map) => string[];

  // All layer IDs used with layerId must be defined here, with later entries
  // drawn on top. Components with layers can't be initialized until this
  // is set. It's not reactive; set it up once at the start.
  layerZorder: string[];
}
