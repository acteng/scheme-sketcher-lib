<script lang="ts">
  import { MapLibre } from "svelte-maplibre";
  import type { Map } from "maplibre-gl";
  import { map } from "$lib/config";
  import ImageLayer from "$lib/draw/image/ImageLayer.svelte";
  import InterventionLayer from "$lib/draw/InterventionLayer.svelte";
  import PolygonToolLayer from "$lib/draw/polygon/PolygonToolLayer.svelte";
  import RouteSnapperLayer from "$lib/draw/route/RouteSnapperLayer.svelte";
  import SplitRouteMode from "$lib/draw/route/SplitRouteMode.svelte";
  import { mode } from "$lib/draw/stores";
  import Toolbox from "$lib/draw/Toolbox.svelte";

  // Use your own key (for MapTiler or another basemap service)
  let apiKey = "MZEJTanw3WpxRvt7qDfo";
</script>

<div style="display: flex; height: 100vh">
  <div class="sidebar">
    <h1>The sidebar</h1>
  </div>
  <div class="map">
    <MapLibre
      style="https://api.maptiler.com/maps/dataviz/style.json?key={apiKey}"
      standardControls
      on:error={(e) => {
        // @ts-expect-error Not exported
        console.log(e.detail.error);
      }}
      bind:map={$map}
      bounds={[-5.96, 49.89, 2.31, 55.94]}
    >
      <!--<Geocoder position="top-right" />-->
      <!--<BoundaryLayer {boundaryGeojson} />-->
      <InterventionLayer />
      <ImageLayer />
      {#if $mode.mode == "list"}
        <Toolbox />
      {:else if $mode.mode == "split-route"}
        <SplitRouteMode />
      {/if}
      <RouteSnapperLayer />
      <PolygonToolLayer />
    </MapLibre>
  </div>
</div>

<style>
  .sidebar {
    width: 30%;
    overflow-y: scroll;
    padding: 10px;
    border: 1px solid black;
  }

  .map {
    position: relative;
    width: 70%;
  }
</style>
