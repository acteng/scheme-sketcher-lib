<script lang="ts" generics="F, S">
  import { mode, pointTool, polygonTool, routeTool } from "./stores";
  import { IconButton, DefaultButton } from "govuk-svelte";
  import imageIcon from "$lib/assets/image.svg";
  import pointIcon from "$lib/assets/point.svg";
  import polygonFreehandIcon from "$lib/assets/polygon_freehand.svg";
  import polygonSnappedIcon from "$lib/assets/polygon_snapped.svg";
  import routeIcon from "$lib/assets/route.svg";
  import splitRouteIcon from "$lib/assets/split_route.svg";
  import streetViewIcon from "$lib/assets/street_view.svg";
  import HoverLayer from "./HoverLayer.svelte";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { map, type Config } from "$lib/config";
  import EditGeometryMode from "./EditGeometryMode.svelte";
  import ImageMode from "./image/ImageMode.svelte";
  import PointMode from "./point/PointMode.svelte";
  import PolygonMode from "./polygon/PolygonMode.svelte";
  import RouteMode from "./route/RouteMode.svelte";
  import SnapPolygonMode from "./snap_polygon/SnapPolygonMode.svelte";
  import StreetViewMode from "./StreetViewMode.svelte";
  import { onDestroy } from "svelte";
  import { PointTool } from "../draw/point/point_tool";
  import { PolygonTool } from "maplibre-draw-polygon";
  import RouteSnapperLoader from "./route/RouteSnapperLoader.svelte";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let routeSnapperUrl: string;

  $: if ($map && !$pointTool) {
    pointTool.set(new PointTool($map));
  }
  $: if ($map && !$polygonTool) {
    polygonTool.set(new PolygonTool($map));
  }

  onDestroy(() => {
    $pointTool?.tearDown();
    $polygonTool?.tearDown();
    $routeTool?.tearDown();
  });
</script>

<HoverLayer {cfg} {gjSchemes} />

<div class="top govuk-prose">
  <!-- We only want one RouteSnapperLoader per lifetime of the page, so we don't
repeatedly load anything. Make sure this is only created once, then just hidden. -->
  <div style:visibility={$mode.mode == "list" ? "visible" : "hidden"}>
    {#if $map}
      <RouteSnapperLoader map={$map} url={routeSnapperUrl} />
    {/if}
  </div>

  {#if $mode.mode == "list"}
    <IconButton
      on:click={() => mode.set({ mode: "new-point" })}
      disabled={!$pointTool}
    >
      <img src={pointIcon} alt="New point" />
      New point
    </IconButton>
    <IconButton
      on:click={() => mode.set({ mode: "new-route" })}
      disabled={!$routeTool}
    >
      <img src={routeIcon} alt="New route" />
      New route
    </IconButton>
    <IconButton
      on:click={() => mode.set({ mode: "new-freehand-polygon" })}
      disabled={!$polygonTool}
    >
      <img src={polygonFreehandIcon} alt="New polygon (freehand)" />
      New polygon (freehand)
    </IconButton>
    <IconButton
      on:click={() => mode.set({ mode: "new-snapped-polygon" })}
      disabled={!$routeTool}
    >
      <img src={polygonSnappedIcon} alt="New polygon (snapped)" />
      New polygon (snapped)
    </IconButton>
    <IconButton on:click={() => mode.set({ mode: "split-route" })}>
      <img src={splitRouteIcon} alt="Split route" />
      Split route
    </IconButton>
    <IconButton on:click={() => mode.set({ mode: "set-image" })}>
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={imageIcon} alt="Georeference image" />
      Georeference image
    </IconButton>
    <IconButton on:click={() => mode.set({ mode: "streetview" })}>
      <img src={streetViewIcon} alt="StreetView" />
      StreetView
    </IconButton>
  {:else if $mode.mode == "edit-geometry"}
    <EditGeometryMode {cfg} {gjSchemes} id={$mode.id} />
  {:else if $mode.mode == "new-point"}
    <h2>New point</h2>
    <PointMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "new-route"}
    <h2>New route</h2>
    <RouteMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "new-freehand-polygon"}
    <h2>New polygon (freehand)</h2>
    <PolygonMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "new-snapped-polygon"}
    <h2>New polygon (snapped)</h2>
    <SnapPolygonMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "split-route"}
    <h2>Split route</h2>
    <DefaultButton on:click={() => mode.set({ mode: "list" })}>
      Finish
    </DefaultButton>

    <ul>
      <li>
        <b>Click</b>
        on a route to split it
      </li>
      <li>
        <b>Click</b>
        on the map or press
        <b>Escape</b>
        to cancel
      </li>
    </ul>
  {:else if $mode.mode == "set-image"}
    <h2>Georeference image</h2>
    <ImageMode />
  {:else if $mode.mode == "streetview"}
    <h2>StreetView</h2>
    <StreetViewMode {cfg} />
  {/if}
</div>

<style>
  .top {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 90%;
    background-color: white;
    border: 1px solid black;

    display: flex;
    justify-content: space-between;
  }
</style>
