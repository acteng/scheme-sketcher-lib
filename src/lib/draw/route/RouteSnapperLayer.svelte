<script lang="ts" generics="F, S">
  import { routeTool, mode } from "$lib/draw/stores";
  import { Marker, MapEvents, GeoJSON, LineLayer } from "svelte-maplibre";
  import type { Schemes, Mode } from "$lib/draw/types";
  import { waypoints, snapMode, type Waypoint } from "./stores";
  import type { MapMouseEvent } from "maplibre-gl";
  import type { Writable } from "svelte/store";
  import type { Feature, FeatureCollection } from "geojson";
  import { RouteTool } from "route-snapper-ts";
  import { Radio } from "govuk-svelte";

  export let gjSchemes: Writable<Schemes<F, S>>;

  let drawMode: "append-start" | "append-end" | "adjust" = "append-end";

  $: routesGj = calculateRoutes($routeTool, $waypoints);

  let hoveredLine: Feature | null = null;
  interface ExtraNode {
    point: [number, number];
    insertIdx: number;
  }
  $: extraNodes = getExtraNodes($routeTool, $waypoints, hoveredLine, drawMode);

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
      if (drawMode == "append-start") {
        w.splice(0, 0, {
          point: e.detail.lngLat.toArray(),
          snapped: $snapMode,
        });
      } else if (drawMode == "append-end") {
        w.push({
          point: e.detail.lngLat.toArray(),
          snapped: $snapMode,
        });
      }
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

  function getExtraNodes(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
    feature: Feature | null,
    drawMode: "append-start" | "append-end" | "adjust",
  ): ExtraNode[] {
    if (!routeTool || drawMode != "adjust") {
      return [];
    }

    // TODO New WASM API, and only grab nodes for the particular line
    routeTool.inner.editExisting(
      waypoints.map((w) => {
        return {
          lon: w.point[0],
          lat: w.point[1],
          snapped: w.snapped,
        };
      }),
    );
    let gj = JSON.parse(routeTool.inner.renderGeojson());
    let nodes = [];
    let insertIdx = 0;
    for (let f of gj.features) {
      if (f.geometry.type != "Point") {
        continue;
      }
      // TODO Need a new WASM API, the order returned won't work
      if (!f.properties.type) {
        insertIdx++;
      } else if (f.properties.type == "node") {
        nodes.push({
          point: f.geometry.coordinates,
          insertIdx,
        });
      }
    }
    return nodes;
  }

  function addNode(node: ExtraNode) {
    waypoints.update((w) => {
      w.splice(node.insertIdx, 0, {
        point: node.point,
        snapped: true,
      });
      return w;
    });
  }
</script>

{#if isActive($mode)}
  <div class="controls">
    <Radio
      label="Mode"
      choices={[
        ["append-start", "Extend from start"],
        ["append-end", "Extend from end"],
        ["adjust", "Drag middle points"],
      ]}
      bind:value={drawMode}
      inlineSmall
    />
  </div>
{/if}

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

<GeoJSON data={routesGj} generateId>
  <LineLayer
    manageHoverState
    bind:hovered={hoveredLine}
    paint={{
      "line-color": "black",
      "line-width": 10,
    }}
  />
</GeoJSON>

{#each extraNodes as node}
  <Marker draggable bind:lngLat={node.point} on:click={() => addNode(node)}>
    <span class="dot node">{node.insertIdx}</span>
  </Marker>
{/each}

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

  .node {
    width: 20px;
    height: 20px;
    background-color: grey;
  }

  .controls {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 90%;
    background-color: white;
    border: 1px solid black;
    padding: 16px;

    display: flex;
    justify-content: space-between;
  }
</style>
