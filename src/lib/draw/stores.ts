import { cfg } from "$lib/config";
import { writable, type Writable } from "svelte/store";
import type { Mode, SchemeCollection } from "./types";
import { PointTool } from "./point/point_tool";
import { PolygonTool } from "maplibre-draw-polygon";
import { RouteTool } from "route-snapper-ts";
import type { Position } from "geojson";
import { isStreetViewImagery, type UserSettings } from "./types";
import { v4 as uuidv4 } from "uuid";
import { randomSchemeColor } from "./colors";

export const pointTool: Writable<PointTool | null> = writable(null);
export const polygonTool: Writable<PolygonTool | null> = writable(null);
// A global singleton, with the route tool loaded for the current map. It's
// null before it's loaded.
export const routeTool: Writable<RouteTool | null> = writable(null);

// scheme_references to hide
export const hideSchemes: Writable<Set<string>> = writable(new Set());

// The optional ID of a feature currently hovered from the sidebar.
export const sidebarHover: Writable<number | null> = writable(null);

export const mode: Writable<Mode> = writable({ mode: "list" });

// All feature IDs must:
//
// - be unique
// - be numeric; parts of maplibre can't handle string IDs
//   (https://github.com/mapbox/mapbox-gl-js/issues/2716)
// - not be 0; some libraries treat this as a missing ID
//
// Although this implementation may appear to ID features in order (1, 2, 3,
// etc), this is NOT an invariant. Do not assume this; it will not be true as
// soon as a user deletes or reorders an intervention.
//
// NOTE! If you call this twice in a row in a `gjScheme.update` transaction
// without adding one of the new features, then this'll return the same ID
// twice!
export function newFeatureId<F, S>(gj: SchemeCollection<F, S>): number {
  let ids = new Set();
  for (let f of gj.features) {
    ids.add(f.id);
  }
  // Always start with ID 1
  let id = ids.size + 1;
  while (ids.has(id)) {
    id++;
  }
  return id;
}

export function deleteIntervention<F, S>(
  gjSchemeCollection: Writable<SchemeCollection<F, S>>,
  id: number,
) {
  console.log(`Deleting intervention ${id}`);
  gjSchemeCollection.update((gj) => {
    gj.features = gj.features.filter((f) => f.id != id);
    return gj;
  });
  sidebarHover.set(null);
  mode.set({ mode: "list" });
}

// When creating a new feature, arbitrarily assign it to the first scheme. The
// user can change it later.
export function getArbitrarySchemeRef<F, S>(
  schemeCollection: SchemeCollection<F, S>,
): string {
  return Object.values(schemeCollection.schemes)[0].scheme_reference;
}

// Per https://datatracker.ietf.org/doc/html/rfc7946#section-11.2, 6 decimal
// places (10cm) is plenty of precision
export function setPrecision(pt: Position): Position {
  return [Math.round(pt[0] * 10e6) / 10e6, Math.round(pt[1] * 10e6) / 10e6];
}

export const userSettings: Writable<UserSettings> =
  writable(loadUserSettings());
userSettings.subscribe((value) =>
  window.localStorage.setItem("userSettings", JSON.stringify(value)),
);

function loadUserSettings(): UserSettings {
  let settings = {
    streetViewImagery: "google",
    avoidDoublingBack: false,
  };

  // Be paranoid when loading from local storage, and only copy over valid items
  try {
    let x = JSON.parse(window.localStorage.getItem("userSettings") || "{}");
    if (isStreetViewImagery(x.streetViewImagery)) {
      settings.streetViewImagery = x.streetViewImagery;
    }
    if (typeof x.avoidDoublingBack == "boolean") {
      settings.avoidDoublingBack = x.avoidDoublingBack;
    }
  } catch (error) {
    console.log(`Couldn't parse userSettings from local storage: ${error}`);
  }
  // The cast is necessary, because of streetViewImagery looking like just a string
  return settings as UserSettings;
}

export function emptyCollection<F, S>(): SchemeCollection<F, S> {
  let gj = {
    type: "FeatureCollection" as const,
    features: [],
    schemes: {},
  };
  addEmptyScheme(gj);
  return gj;
}

export function addEmptyScheme<F, S>(gj: SchemeCollection<F, S>) {
  let scheme_reference = uuidv4();
  let scheme = {
    scheme_reference,
    color: randomSchemeColor(),
  };
  cfg.initializeEmptyScheme(scheme);
  gj.schemes[scheme_reference] = scheme;
}
