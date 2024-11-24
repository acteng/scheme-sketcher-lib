import type { GeoJSON } from "geojson";
import { emptyGeojson } from "$lib/maplibre";
import { writable, type Writable } from "svelte/store";

// These are necessary to communicate between components nested under the sidebar and map

export const snapMode: Writable<boolean> = writable(true);
export const undoLength: Writable<number> = writable(0);

export interface Waypoint {
  point: [number, number];
  snapped: boolean;
}

export const waypoints: Writable<Waypoint[]> = writable([]);
