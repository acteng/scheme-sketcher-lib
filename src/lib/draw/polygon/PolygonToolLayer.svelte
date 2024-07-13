<script lang="ts" generics="F, S">
  import { circleRadius, colors } from "$lib/draw/colors";
  import { isLine, isPoint, isPolygon, layerId } from "$lib/maplibre";
  import { CircleLayer, FillLayer, GeoJSON, LineLayer } from "svelte-maplibre";
  import { polygonToolGj } from "maplibre-draw-polygon";
  import { type Config } from "$lib/config";

  export let cfg: Config<F, S>;
</script>

<GeoJSON data={$polygonToolGj}>
  <FillLayer
    {...layerId(cfg, "edit-polygon-fill")}
    filter={isPolygon}
    paint={{
      "fill-color": "red",
      "fill-opacity": [
        "case",
        ["boolean", ["get", "hover"], "false"],
        1.0,
        0.5,
      ],
    }}
  />
  <LineLayer
    {...layerId(cfg, "edit-polygon-lines")}
    filter={isLine}
    paint={{
      // TODO Dashed
      "line-color": "black",
      "line-width": 8,
      "line-opacity": 0.5,
    }}
  />
  <CircleLayer
    {...layerId(cfg, "edit-polygon-vertices")}
    filter={isPoint}
    paint={{
      "circle-color": colors.hovering,
      "circle-opacity": ["case", ["has", "hovered"], 1.0, 0.5],
      "circle-radius": circleRadius,
    }}
  />
</GeoJSON>
