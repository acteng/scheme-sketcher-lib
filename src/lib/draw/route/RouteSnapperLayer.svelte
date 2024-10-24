<script lang="ts">
  import type { Feature } from "geojson";
  import {
    constructMatchExpression,
    isLine,
    isPoint,
    isPolygon,
    layerId,
    type ConfigWithZorder,
  } from "$lib/maplibre";
  import { CircleLayer, FillLayer, GeoJSON, LineLayer } from "svelte-maplibre";
  import { routeToolGj } from "./stores";

  export let cfg: ConfigWithZorder;

  const circleRadiusPixels = 10;

  function getNumber(feature: Feature): string {
    return feature.properties?.number;
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
