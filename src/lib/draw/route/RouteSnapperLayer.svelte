<script lang="ts" generics="F, S">
  import type { Feature } from "geojson";
  import {
    constructMatchExpression,
    isLine,
    isPoint,
    isPolygon,
    layerId,
    type ConfigWithZorder,
  } from "$lib/maplibre";
  import {
    CircleLayer,
    FillLayer,
    GeoJSON,
    LineLayer,
    MarkerLayer,
  } from "svelte-maplibre";
  import {
    geocoderGj,
    routeToolGj,
    showAllNodes,
    showAllNodesGj,
  } from "./stores";
  import { mode } from "$lib/draw/stores";
  import type { Writable } from "svelte/store";
  import type { Schemes, Mode } from "$lib/draw/types";

  export let cfg: ConfigWithZorder;
  export let gjSchemes: Writable<Schemes<F, S>>;

  const circleRadiusPixels = 10;

  function getNumber(feature: Feature): string {
    return feature.properties?.number;
  }

  function showSnapping(mode: Mode): boolean {
    if (mode.mode == "edit-geometry") {
      let feature = $gjSchemes.features.find((f) => f.id == mode.id)!;
      return "waypoints" in feature.properties;
    } else if (mode.mode == "new-snapped-polygon" || mode.mode == "new-route") {
      return true;
    }
    return false;
  }
</script>

<GeoJSON data={$routeToolGj}>
  <CircleLayer
    {...layerId(cfg, "route-points")}
    filter={isPoint}
    paint={{
      "circle-color": constructMatchExpression(
        ["get", "type"],
        {
          "snapped-waypoint": "red",
          "free-waypoint": "blue",
        },
        "black",
      ),
      "circle-opacity": ["case", ["has", "hovered"], 0.5, 1.0],
      "circle-radius": constructMatchExpression(
        ["get", "type"],
        { node: circleRadiusPixels / 2.0 },
        circleRadiusPixels,
      ),
    }}
  />
  <LineLayer
    {...layerId(cfg, "route-lines")}
    filter={isLine}
    paint={{
      "line-color": ["case", ["get", "snapped"], "red", "blue"],
      "line-width": 2.5,
    }}
  />
  <FillLayer
    {...layerId(cfg, "route-polygons")}
    filter={isPolygon}
    paint={{
      "fill-color": "black",
      "fill-opacity": 0.5,
    }}
  />
</GeoJSON>

<GeoJSON data={$showAllNodesGj}>
  <CircleLayer
    {...layerId(cfg, "route-debug-nodes")}
    paint={{
      "circle-opacity": 0,
      "circle-radius": 5,
      "circle-stroke-color": "black",
      "circle-stroke-width": 1,
    }}
    layout={{
      visibility: $showAllNodes && showSnapping($mode) ? "visible" : "none",
    }}
    minzoom={13}
  />
</GeoJSON>

<GeoJSON data={$geocoderGj}>
  <MarkerLayer let:feature>
    <div
      style="font-size: 30px; background: white; padding: 16px; border-radius: 50%;"
    >
      {getNumber(feature)}
    </div>
  </MarkerLayer>
</GeoJSON>
