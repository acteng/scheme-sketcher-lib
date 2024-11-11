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

  let emptyGj = {
    type: "FeatureCollection" as const,
    features: [],
  };

  let drawMode: "append-start" | "append-end" | "adjust" = "append-end";

  $: routesGj = calculateRoutes($routeTool, $waypoints);

  // TODO Remove unless we start using this
  let hoveredLine: Feature | null = null;
  interface ExtraNode {
    point: [number, number];
    insertIdx: number;
  }
  $: extraNodes = getExtraNodes($routeTool, $waypoints, hoveredLine, drawMode);

  let cursor: Waypoint | null = null;
  $: previewGj = getPreview($routeTool, $waypoints, drawMode, cursor);

  function isActive(mode: Mode): boolean {
    if (mode.mode == "edit") {
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

  function onMouseMove(e: CustomEvent<MapMouseEvent>) {
    cursor = {
      point: e.detail.lngLat.toArray(),
      snapped: true,
    };
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
    try {
      if (routeTool) {
        return JSON.parse(routeTool.inner.calculateRoute(waypoints));
      }
    } catch (err) {}
    return emptyGj;
  }

  function getPreview(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
    drawMode: "append-start" | "append-end" | "adjust",
    cursor: Waypoint | null,
  ): FeatureCollection {
    try {
      if (routeTool && waypoints.length > 0 && cursor) {
        if (drawMode == "append-start") {
          return JSON.parse(
            routeTool.inner.calculateRoute([cursor, waypoints[0]]),
          );
        } else if (drawMode == "append-end") {
          return JSON.parse(
            routeTool.inner.calculateRoute([
              waypoints[waypoints.length - 1],
              cursor,
            ]),
          );
        }
      }
    } catch (err) {}
    return emptyGj;
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

    let nodes = [];
    let insertIdx = 1;

    // TODO try/catch
    for (let i = 0; i < waypoints.length - 1; i++) {
      // TODO Exclude the first/last in the WASM API, not here
      let extra = JSON.parse(
        routeTool.inner.getExtraNodes(waypoints[i], waypoints[i + 1]),
      );
      extra.shift();
      extra.pop();
      for (let point of extra) {
        nodes.push({ point, insertIdx });
      }
      insertIdx++;
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

<MapEvents on:click={onMapClick} on:mousemove={onMouseMove} />

{#each extraNodes as node}
  <Marker draggable bind:lngLat={node.point} on:click={() => addNode(node)}>
    <span class="dot node">{node.insertIdx}</span>
  </Marker>
{/each}

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

<GeoJSON data={previewGj}>
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
