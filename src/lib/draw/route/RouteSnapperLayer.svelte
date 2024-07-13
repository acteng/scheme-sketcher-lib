<script lang="ts" generics="F, S">
  import { type Config } from "$lib/config";
  import type { Feature } from "geojson";
  import {
    constructMatchExpression,
    isLine,
    isPoint,
    isPolygon,
    layerId,
  } from "$lib/maplibre";
  import {
    CircleLayer,
    FillLayer,
    GeoJSON,
    LineLayer,
    MarkerLayer,
  } from "svelte-maplibre";
  import { geocoderGj, routeToolGj } from "./stores";

  export let cfg: Config<F, S>;

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

<GeoJSON data={$geocoderGj}>
  <MarkerLayer let:feature>
    <div
      style="font-size: 30px; background: white; padding: 16px; border-radius: 50%;"
    >
      {getNumber(feature)}
    </div>
  </MarkerLayer>
</GeoJSON>
