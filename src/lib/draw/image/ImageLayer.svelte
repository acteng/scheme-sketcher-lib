<script lang="ts" generics="F, S">
  import { map, type Config } from "$lib/config";
  import { mode } from "$lib/draw/stores";
  import { layerId } from "$lib/maplibre";
  import { ImageSource, Marker, RasterLayer } from "svelte-maplibre";
  import { imgSrc, opacity } from "./stores";

  export let cfg: Config<F, S>;

  let topLeft = { lng: 0, lat: 0 };
  let bottomRight = { lng: 0, lat: 0 };

  $: if (
    $map &&
    $imgSrc &&
    $mode.mode == "set-image" &&
    topLeft.lng == 0 &&
    topLeft.lat == 0
  ) {
    // Reset the markers to cover some of the current viewport
    let bounds = $map.getBounds();
    topLeft.lng =
      bounds.getWest() + 0.4 * (bounds.getEast() - bounds.getWest());
    bottomRight.lng =
      bounds.getWest() + 0.6 * (bounds.getEast() - bounds.getWest());
    topLeft.lat =
      bounds.getNorth() + 0.4 * (bounds.getSouth() - bounds.getNorth());
    bottomRight.lat =
      bounds.getNorth() + 0.6 * (bounds.getSouth() - bounds.getNorth());
  }
</script>

{#if $imgSrc}
  <ImageSource
    url={$imgSrc}
    coordinates={[
      [topLeft.lng, topLeft.lat],
      [bottomRight.lng, topLeft.lat],
      [bottomRight.lng, bottomRight.lat],
      [topLeft.lng, bottomRight.lat],
    ]}
  >
    <RasterLayer
      {...layerId(cfg, "georeferenced-image")}
      paint={{
        "raster-fade-duration": 0,
        "raster-opacity": $opacity / 100.0,
      }}
    />
  </ImageSource>
{/if}

{#if $imgSrc && $mode.mode == "set-image"}
  <Marker bind:lngLat={topLeft} draggable>
    <span class="dot" style="background-color: red" />
  </Marker>
  <Marker bind:lngLat={bottomRight} draggable>
    <span class="dot" style="background-color: blue" />
  </Marker>
{/if}

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }
</style>
