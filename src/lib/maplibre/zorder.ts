import { map as mapStore } from "$lib/config";
import { get } from "svelte/store";

interface LayerProps {
  id: string;
  beforeId: string | undefined;
}

// Just require the subset of config needed, to make it easier for some callers
export interface ConfigWithZorder {
  layerZorder: string[];
}

// Use this helper for every svelte-maplibre layer component. It sets the layer
// ID, beforeId (for z-ordering between layers), and defaults to only using the
// top-most layer for hovering/clicking.
export function layerId(cfg: ConfigWithZorder, layerId: string): LayerProps {
  return {
    id: layerId,
    beforeId: getBeforeId(cfg, layerId),
  };
}

// Calculates the beforeId for adding a layer. Due to hot-module reloading and
// Svelte component initialization order being unpredictable, callers might add
// layers in any order. Use beforeId to guarantee the layers wind up in an
// explicitly defined order.
function getBeforeId(
  cfg: ConfigWithZorder,
  layerId: string,
): string | undefined {
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
  for (let i = cfg.layerZorder.length - 1; i >= 0; i--) {
    let id = cfg.layerZorder[i];
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
