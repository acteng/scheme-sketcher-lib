import type { FeatureCollection as GeocodingFC } from "@maptiler/geocoding-control/types";
import type { FeatureCollection, Point, GeoJSON } from "geojson";
import { emptyGeojson } from "$lib/maplibre";
import { writable, type Writable } from "svelte/store";

// These are necessary to communicate between components nested under the sidebar and map

export const routeToolGj: Writable<GeoJSON> = writable(emptyGeojson());
export const geocoderGj: Writable<GeocodingFC> = writable(
  emptyGeojson() as GeocodingFC,
);
export const snapMode: Writable<boolean> = writable(true);
export const undoLength: Writable<number> = writable(0);
export const showAllNodes: Writable<boolean> = writable(false);
export const showAllNodesGj: Writable<FeatureCollection> = writable({
  type: "FeatureCollection",
  features: [],
});

export interface Waypoint {
  point: [number, number];
  snapped: boolean;
}

export const waypoints: Writable<Waypoint[]> = writable([]);
