import type { Feature, Geometry } from "geojson";
import type { Waypoint } from "route-snapper-ts";

export type Mode =
  | {
      mode: "list";
    }
  | {
      mode: "edit-form";
      id: number;
    }
  | {
      mode: "edit-geometry";
      id: number;
    }
  | { mode: "new-point" }
  | { mode: "new-freehand-polygon" }
  | { mode: "new-snapped-polygon" }
  | { mode: "new-route" }
  | { mode: "split-route" }
  | { mode: "set-image" }
  | { mode: "streetview" };

// This library manages some properties, in addition to the generic user-specified ones.
export type FeatureProps<F> = F & {
  scheme_reference: string;

  // Temporary state, not meant to be serialized
  hide_while_editing?: boolean;

  // For LineStrings only
  length_meters?: number;
  // For LineStrings and Polygons only
  waypoints?: Waypoint[];
};

// TODO Rename
export type FeatureWithID<F, G extends Geometry = Geometry> = Feature<G> & {
  id: number;
  properties: FeatureProps<F>;
};

export interface SchemeCollection<F, S> {
  type: "FeatureCollection";
  features: FeatureWithID<F>[];
  // Keyed by scheme_reference, which doesn't change over the lifetime of the sketch tool
  schemes: { [reference: string]: SchemeData & S };
}

export interface SchemeData {
  // The key into SchemeCollection.schemes
  scheme_reference: string;
  // For the sketch page; not important
  color: string;
}

// Remember settings from different tools
export interface UserSettings {
  // From the StreetView tool
  streetViewImagery: "google" | "bing";

  // From the Route tool
  avoidDoublingBack: boolean;
}

export function isStreetViewImagery(x: string): x is "google" | "bing" {
  return x == "google" || x == "bing";
}
