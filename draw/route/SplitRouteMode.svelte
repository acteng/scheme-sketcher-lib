<script>import { splitRoute } from "route-snapper-ts";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import {
  gjSchemeCollection,
  mode,
  newFeatureId,
  setPrecision
} from "../stores";
import { emptyGeojson, layerId } from "../../maplibre";
import { map } from "../../config";
import { onDestroy, onMount } from "svelte";
import { CircleLayer, GeoJSON, MapEvents } from "svelte-maplibre";
import splitIcon from "../../assets/split_route.svg";
const circleRadiusPixels = 10;
const snapDistancePixels = 30;
onMount(() => {
  if ($map) {
    $map.getCanvas().style.cursor = `url(${splitIcon}), crosshair`;
  }
});
onDestroy(() => {
  if ($map) {
    $map.getCanvas().style.cursor = "inherit";
  }
});
let snappedCursor = null;
let snappedIndex = null;
let snappedCursorGj = emptyGeojson();
$: {
  let gj = emptyGeojson();
  if (snappedCursor) {
    gj.features.push(snappedCursor);
  }
  snappedCursorGj = gj;
}
function onMouseMove(e) {
  if (!$map) {
    return;
  }
  snappedCursor = null;
  snappedIndex = null;
  let cursor = cursorFeature(e.detail.lngLat.toArray());
  const nearbyPoint = [
    e.detail.point.x - snapDistancePixels,
    e.detail.point.y
  ];
  const thresholdKm = $map.unproject(e.detail.point).distanceTo($map.unproject(nearbyPoint)) / 1e3;
  let candidates = [];
  for (let [index, f] of $gjSchemeCollection.features.entries()) {
    if (f.geometry.type == "LineString") {
      let snapped = nearestPointOnLine(f.geometry, cursor, {
        units: "kilometers"
      });
      if (snapped.properties.dist != void 0 && snapped.properties.dist <= thresholdKm) {
        candidates.push([
          index,
          snapped.geometry.coordinates,
          snapped.properties.dist
        ]);
      }
    }
  }
  candidates.sort((a, b) => a[2] - b[2]);
  if (candidates.length > 0) {
    snappedCursor = cursorFeature(candidates[0][1]);
    snappedIndex = candidates[0][0];
  }
}
function onClick() {
  if (snappedIndex == null) {
    mode.set({ mode: "list" });
    return;
  }
  let result = splitRoute(
    $gjSchemeCollection.features[snappedIndex],
    snappedCursor
  );
  if (result != null) {
    let [piece1, piece2] = result;
    gjSchemeCollection.update((gj) => {
      piece1.id = gj.features[snappedIndex].id;
      piece2.id = newFeatureId(gj);
      gj.features.splice(snappedIndex, 1, piece1, piece2);
      return gj;
    });
  }
  snappedCursor = null;
  snappedIndex = null;
}
function onKeyDown(e) {
  if (e.key == "Escape") {
    e.stopPropagation();
    mode.set({ mode: "list" });
  }
}
function cursorFeature(pt) {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: setPrecision(pt)
    }
  };
}
</script>

<svelte:window on:keydown={onKeyDown} />

<MapEvents on:mousemove={onMouseMove} on:click={onClick} />

<GeoJSON data={snappedCursorGj}>
  <CircleLayer
    {...layerId("draw-split-route")}
    paint={{ "circle-color": "black", "circle-radius": circleRadiusPixels }}
  />
</GeoJSON>
