import type { GeoJSON } from "geojson";
import { emptyGeojson } from "$lib/maplibre";
import { writable, type Writable } from "svelte/store";
import { RouteTool } from "route-snapper-ts";
import type { Feature, Polygon } from "geojson";

// These are necessary to communicate between components nested under the sidebar and map

export const snapMode: Writable<boolean> = writable(true);
export const undoLength: Writable<number> = writable(0);

export interface Waypoint {
  point: [number, number];
  snapped: boolean;
}

export const waypoints: Writable<Waypoint[]> = writable([]);

export function calculateArea(
  routeTool: RouteTool,
  waypoints: Waypoint[],
): Feature<Polygon> {
  // TODO Or just fail?
  if (waypoints.length < 3) {
    return JSON.parse(routeTool.inner.calculateRoute(waypoints));
  }

  // Glue the end to the start
  let copy = JSON.parse(JSON.stringify(waypoints));
  copy.push(copy[0]);
  let out = JSON.parse(routeTool.inner.calculateRoute(copy));
  out.properties.waypoints.pop();
  out.geometry.type = "Polygon";
  out.geometry.coordinates = [out.geometry.coordinates];
  return out;
}
