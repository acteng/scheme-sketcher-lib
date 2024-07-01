import type { Feature, Geometry } from "geojson";

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

// Properties are guaranteed to exist, but can be anything, so TS is mostly disabled
export type FeatureWithAnyProps<G extends Geometry = Geometry> = Feature<G> & {
  properties: { [name: string]: any };
};

export interface SchemeCollection {
  type: "FeatureCollection";
  // TODO Specifying scheme_reference would be nice
  features: FeatureWithAnyProps[];
  // Keyed by scheme_reference, which doesn't change over the lifetime of the sketch tool
  schemes: { [reference: string]: SchemeData };
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
