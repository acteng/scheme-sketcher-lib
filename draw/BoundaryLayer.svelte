<script>import mask from "@turf/mask";
import { bbox, layerId } from "../maplibre";
import { map } from "../config";
import { getContext } from "svelte";
import { FillLayer, GeoJSON } from "svelte-maplibre";
export let boundaryGeojson;
export let fitBoundsAtStart = false;
if (getContext("setCamera") || fitBoundsAtStart) {
  $map?.fitBounds(bbox(boundaryGeojson), {
    padding: 20,
    animate: false
  });
}
</script>

<GeoJSON data={mask(boundaryGeojson)}>
  <FillLayer
    {...layerId("boundary")}
    paint={{
      "fill-color": "black",
      "fill-opacity": 0.5,
    }}
  />
</GeoJSON>
