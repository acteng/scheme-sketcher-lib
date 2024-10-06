<script lang="ts" generics="F, S">
  import { routeTool, mode } from "$lib/draw/stores";
  import { Marker, MapEvents, GeoJSON, LineLayer } from "svelte-maplibre";
  import type { Schemes, Mode } from "$lib/draw/types";
  import { waypoints, snapMode, type Waypoint } from "./stores";
  import type { MapMouseEvent } from "maplibre-gl";
  import type { Writable } from "svelte/store";
  import type { FeatureCollection } from "geojson";
  import { RouteTool } from "route-snapper-ts";

  export let gjSchemes: Writable<Schemes<F, S>>;

  $: routesGj = calculateRoutes($routeTool, $waypoints);

  function isActive(mode: Mode): boolean {
    if (mode.mode == "edit-geometry") {
      let feature = $gjSchemes.features.find((f) => f.id == mode.id)!;
      return feature.geometry.type == "LineString";
    } else if (mode.mode == "new-route") {
      return true;
    }
    return false;
  }

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
    if (!isActive($mode)) {
      return;
    }

    waypoints.update((w) => {
      w.push({
        point: e.detail.lngLat.toArray(),
        snapped: $snapMode,
      });
      return w;
    });
  }

  function toggleSnapped(idx: number) {
    waypoints.update((w) => {
      w[idx].snapped = !w[idx].snapped;
      return w;
    });
  }

  function removeWaypoint(idx: number) {
    waypoints.update((w) => {
      w.splice(idx, 1);
      return w;
    });
  }

  function calculateRoutes(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
  ): FeatureCollection {
    let emptyGj = {
      type: "FeatureCollection" as const,
      features: [],
    };
    if (!routeTool) {
      return emptyGj;
    }

    // TODO Totally different WASM API, please -- much simpler stateless one
    // TODO Match up directly
    routeTool.inner.editExisting(
      waypoints.map((w) => {
        return {
          lon: w.point[0],
          lat: w.point[1],
          snapped: w.snapped,
        };
      }),
    );
    let out = routeTool.inner.toFinalFeature();
    return out ? JSON.parse(out) : emptyGj;
  }
</script>

<MapEvents on:click={onMapClick} />

{#each $waypoints as waypt, idx}
  <Marker
    draggable
    bind:lngLat={waypt.point}
    on:click={() => toggleSnapped(idx)}
    on:contextmenu={() => removeWaypoint(idx)}
  >
    <span class="dot" class:snapped={waypt.snapped}>{idx + 1}</span>
  </Marker>
{/each}

<GeoJSON data={routesGj}>
  <LineLayer
    paint={{
      "line-color": "black",
      "line-width": 3,
    }}
  />
</GeoJSON>

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    background-color: blue;
    font-weight: bold;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }

  .snapped {
    background-color: red;
  }
</style>
