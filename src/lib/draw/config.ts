import {
  newFeatureId,
  getArbitrarySchemeRef,
  gjSchemeCollection,
} from "$lib/draw/stores";
import type { FeatureWithAnyProps } from "$lib/draw/types";
import type { Feature, LineString, Polygon, Point } from "geojson";
import { get } from "svelte/store";

// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.

// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things

export let cfg = {
  interventionName: (f: FeatureWithAnyProps) => {
    return f.properties.name || `untitled ${f.geometry.type}`;
  },

  newPointFeature: (f: Feature<Point>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      f.properties.intervention_type = "other";
      gj.features.push(f);
      return gj;
    });
  },

  newPolygonFeature: (f: Feature<Polygon>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      f.properties.intervention_type = "area";
      gj.features.push(f);
      return gj;
    });
  },

  newLineStringFeature: (f: Feature<LineString>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      f.properties.intervention_type = "route";
      gj.features.push(f);
      return gj;
    });
  },

  updateFeature: (
    destination: FeatureWithAnyProps,
    source: FeatureWithAnyProps,
  ) => {
    // Don't do anything by default
  },
};
