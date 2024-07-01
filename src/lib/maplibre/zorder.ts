import { map as mapStore } from "$lib/config";
import { get } from "svelte/store";

interface LayerProps {
  id: string;
  beforeId: string | undefined;
}

// Use this helper for every svelte-maplibre layer component. It sets the layer
// ID, beforeId (for z-ordering between layers), and defaults to only using the
// top-most layer for hovering/clicking.
export function layerId(layerId: string): LayerProps {
  return {
    id: layerId,
    beforeId: getBeforeId(layerId),
  };
}

// Calculates the beforeId for adding a layer. Due to hot-module reloading and
// Svelte component initialization order being unpredictable, callers might add
// layers in any order. Use beforeId to guarantee the layers wind up in an
// explicitly defined order.
function getBeforeId(layerId: string): string | undefined {
  let map = get(mapStore);
  if (!map) {
    console.warn(
      `getBeforeId(${layerId}) called before map is ready. Z-ordering may be incorrect.`,
    );
    return undefined;
  }

  // Find the last layer currently in the map that should be on top of this new
  // layer.
  let beforeId = undefined;
  let found = false;
  for (let i = layerZorder.length - 1; i >= 0; i--) {
    let id = layerZorder[i];
    if (id == layerId) {
      found = true;
      break;
    }
    if (map.getLayer(id)) {
      beforeId = id;
    }
  }
  // When adding a new layer somewhere, force the programmer to decide where it
  // should be z-ordered.
  if (!found) {
    throw new Error(`Layer ID ${layerId} not defined in layerZorder`);
  }
  // If beforeId isn't set, we'll add the layer on top of everything else.
  return beforeId;
}

// All layer IDs used with layerId must be defined here, with later entries
// drawn on top.
const layerZorder = [
  // Polygons are bigger than lines, which're bigger than points. When geometry
  // overlaps, put the smaller thing on top
  "interventions-coverage-polygons-outlines",
  "interventions-polygons",
  "interventions-polygons-outlines",
  // This is an outline, so draw on top
  "hover-polygons",

  // The hover effect thickens, so draw beneath
  "hover-lines",
  "interventions-lines",
  "interventions-lines-endpoints",

  "hover-points",
  "interventions-points",

  "edit-polygon-fill",
  "edit-polygon-lines",
  "edit-polygon-vertices",

  "draw-split-route",

  "route-points",
  "route-lines",
  "route-polygons",

  // TODO Move this to the sveltekit demo app. It assumes a basemap.
  "road_label",

  // Draw the inverted boundary fade on top of basemap labels
  "boundary",

  // TODO This might look nicer lower
  "georeferenced-image",
];
