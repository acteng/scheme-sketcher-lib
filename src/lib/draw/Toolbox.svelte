<script lang="ts" generics="F, S">
  import { mode, routeTool } from "./stores";
  import imageIcon from "$lib/assets/image.svg";
  import pointIcon from "$lib/assets/point.svg";
  import areaIcon from "$lib/assets/area.svg";
  import routeIcon from "$lib/assets/route.svg";
  import splitRouteIcon from "$lib/assets/split_route.svg";
  import streetViewIcon from "$lib/assets/street_view.svg";
  import HoverLayer from "./HoverLayer.svelte";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { map, type Config } from "$lib/config";
  import EditMode from "./EditMode.svelte";
  import ImageMode from "./image/ImageMode.svelte";
  import PointMode from "./point/PointMode.svelte";
  import RouteMode from "./route/RouteMode.svelte";
  import SplitRouteMode from "./route/SplitRouteMode.svelte";
  import AreaMode from "./area/AreaMode.svelte";
  import StreetViewMode from "./StreetViewMode.svelte";
  import { onDestroy } from "svelte";
  import RouteSnapperLoader from "./route/RouteSnapperLoader.svelte";
  import ToolButton from "./ToolButton.svelte";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let routeSnapperUrl: string;

  onDestroy(() => {
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

  <div class="toolbar">
    <ToolButton setMode={{ mode: "new-point" }}>
      <img src={pointIcon} alt="New point" />
      New point
    </ToolButton>
    <ToolButton setMode={{ mode: "new-route" }} disabled={!$routeTool}>
      <img src={routeIcon} alt="New route" />
      New route
    </ToolButton>
    <ToolButton setMode={{ mode: "new-area" }} disabled={!$routeTool}>
      <img src={areaIcon} alt="New area" />
      New area
    </ToolButton>
    <ToolButton setMode={{ mode: "split-route" }}>
      <img src={splitRouteIcon} alt="Split route" />
      Split route
    </ToolButton>
    <ToolButton setMode={{ mode: "set-image" }}>
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={imageIcon} alt="Georeference image" />
      Georeference image
    </ToolButton>
    <ToolButton setMode={{ mode: "streetview" }}>
      <img src={streetViewIcon} alt="StreetView" />
      StreetView
    </ToolButton>
  </div>

  {#if $mode.mode != "list"}
    <div style="height: 1em" />
  {/if}

  {#if $mode.mode == "edit"}
    <EditMode {cfg} {gjSchemes} id={$mode.id} />
  {:else if $mode.mode == "new-point"}
    <PointMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "new-route"}
    <RouteMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "new-area"}
    <AreaMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "split-route"}
    <SplitRouteMode {cfg} {gjSchemes} />
  {:else if $mode.mode == "set-image"}
    <ImageMode />
  {:else if $mode.mode == "streetview"}
    <StreetViewMode {cfg} />
  {/if}
</div>

<style>
  .top {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 90%;
    background-color: #d9d9d9;
    border: 1px solid black;
    padding: 4px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    background-color: white;
  }
</style>
