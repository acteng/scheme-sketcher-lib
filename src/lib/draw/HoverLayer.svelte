<script lang="ts" generics="F, S">
  import type { Config } from "$lib/config";
  import { circleRadius, colors, lineWidth } from "$lib/draw/colors";
  import { sidebarHover } from "$lib/draw/stores";
  import type { Schemes } from "$lib/draw/types";
  import {
    emptyGeojson,
    isLine,
    isPoint,
    isPolygon,
    layerId,
  } from "$lib/maplibre";
  import { CircleLayer, GeoJSON, LineLayer } from "svelte-maplibre";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  // Use a layer that only ever has zero or one features for hovering.
  $: gj =
    $sidebarHover == null
      ? emptyGeojson()
      : $gjSchemes.features.find((f) => f.id == $sidebarHover)!;
</script>

<GeoJSON data={gj}>
  <LineLayer
    {...layerId(cfg, "hover-polygons")}
    filter={isPolygon}
    paint={{
      "line-color": colors.hovering,
      "line-width": 0.5 * lineWidth,
    }}
  />
  <LineLayer
    {...layerId(cfg, "hover-lines")}
    filter={isLine}
    paint={{
      "line-color": colors.hovering,
      "line-width": 1.5 * lineWidth,
    }}
  />
  <CircleLayer
    {...layerId(cfg, "hover-points")}
    filter={isPoint}
    paint={{
      "circle-color": colors.hovering,
      "circle-radius": 1.5 * circleRadius,
    }}
  />
</GeoJSON>
