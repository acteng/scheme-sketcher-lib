<script lang="ts">
  import mask from "@turf/mask";
  import { map } from "$lib/config";
  import { bbox, layerId, type ConfigWithZorder } from "$lib/maplibre";
  import type {
    Feature,
    FeatureCollection,
    MultiPolygon,
    Polygon,
  } from "geojson";
  import { getContext } from "svelte";
  import { FillLayer, GeoJSON } from "svelte-maplibre";

  export let cfg: ConfigWithZorder;
  export let boundaryGeojson:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>;
  export let fitBoundsAtStart = false;

  // If the URL didn't initially have a viewport set, fit the boundary
  if (getContext("setCamera") || fitBoundsAtStart) {
    $map?.fitBounds(bbox(boundaryGeojson), {
      padding: 20,
      animate: false,
    });
  }
</script>

<GeoJSON data={mask(boundaryGeojson)}>
  <FillLayer
    {...layerId(cfg, "boundary")}
    paint={{
      "fill-color": "black",
      "fill-opacity": 0.5,
    }}
  />
</GeoJSON>
