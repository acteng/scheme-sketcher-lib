import {
  newFeatureId,
  getArbitrarySchemeRef,
  gjSchemeCollection,
} from "$lib/draw/stores";
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
export const mapStyle: Writable<string> = writable("dataviz");

// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.

// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things

export let cfg = {
  interventionName: (f: FeatureWithAnyProps) => {
    return f.properties.name || `Untitled ${f.geometry.type}`;
  },

  schemeName: (s: SchemeData) => {
    return `scheme ${s.scheme_reference}`;
  },

  backfill: (json: any) => {
    return json as SchemeCollection;
  },

  interventionWarning: (feature: FeatureWithAnyProps) => {
    return null;
  },

  editFeatureForm: null as null | ComponentType<
    SvelteComponent<{
      props: { [name: string]: any };
    }>
  >,

  newPointFeature: (f: Feature<Point>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      gj.features.push(f as FeatureWithID);
      return gj;
    });
  },

  newPolygonFeature: (f: Feature<Polygon>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      gj.features.push(f as FeatureWithID);
      return gj;
    });
  },

  newLineStringFeature: (f: Feature<LineString>) => {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      gj.features.push(f as FeatureWithID);
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
