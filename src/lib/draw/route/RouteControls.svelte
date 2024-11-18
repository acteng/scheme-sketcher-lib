<script lang="ts">
  import { routeTool, mode, userSettings } from "$lib/draw/stores";
  import {
    snapMode,
    undoLength,
    showAllNodes,
    showAllNodesGj,
    waypoints,
    type Waypoint,
  } from "./stores";
  import { HelpButton } from "$lib/common";
  import TinyRadio from "../TinyRadio.svelte";
  import { v4 as uuidv4 } from "uuid";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import { Marker, MapEvents, GeoJSON, LineLayer } from "svelte-maplibre";
  import type { Schemes, Mode } from "$lib/draw/types";
  import type { MapMouseEvent } from "maplibre-gl";
  import type { Feature, FeatureCollection } from "geojson";
  import { RouteTool } from "route-snapper-ts";

  export let finish: () => void;
  export let cancel: () => void;

  let emptyGj = {
    type: "FeatureCollection" as const,
    features: [],
  };

  let drawMode: "append-start" | "append-end" | "adjust" = "append-end";

  $: routesGj = calculateRoutes($routeTool, $waypoints);

  interface ExtraNode {
    point: [number, number];
    insertIdx: number;
  }
  let extraNodes: ExtraNode[] = [];
  $: updateExtraNodes($routeTool, $waypoints, drawMode);

  let cursor: Waypoint | null = null;
  let hoveringOnMarker = false;
  let draggingMarker = false;
  $: previewGj = getPreview(
    $routeTool,
    $waypoints,
    drawMode,
    cursor,
    hoveringOnMarker || draggingMarker,
  );

  let checkboxId = uuidv4();

  // TODO some of these change now too
  function undo() {
    $routeTool!.undo();
  }

  function toggleSnap() {
    $snapMode = !$snapMode;
    if (cursor) {
      cursor.snapped = $snapMode;
    }
  }

  function loadNodes(show: boolean) {
    if (show && $showAllNodesGj.features.length == 0) {
      $showAllNodesGj = JSON.parse($routeTool!.inner.debugSnappableNodes());
    }
  }
  $: loadNodes($showAllNodes);

  // Show snappable nodes when going from freehand to snapped
  let first = true;
  function freeToSnapped(snapped: boolean) {
    if (first) {
      first = false;
      return;
    }
    if (snapped) {
      $showAllNodes = true;
      // TODO Not sure why, but this isn't triggering the reactive statement above
      loadNodes(true);
    }
  }
  $: freeToSnapped($snapMode);

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
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
      snapped: $snapMode,
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
    suppress: boolean,
  ): FeatureCollection {
    if (suppress) {
      return emptyGj;
    }
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

  function updateExtraNodes(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
    drawMode: "append-start" | "append-end" | "adjust",
  ) {
    if (!routeTool || drawMode != "adjust") {
      extraNodes = [];
      return;
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

    extraNodes = nodes;
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

  function keyDown(e: KeyboardEvent) {
    let tag = (e.target as HTMLElement).tagName;
    let formFocused = tag == "INPUT" || tag == "TEXTAREA";

    if (e.key === "Enter" && !formFocused) {
      e.stopPropagation();
      finish();
    } else if (e.key === "Escape") {
      e.stopPropagation();
      cancel();
    } else if (e.key == "s" && !formFocused) {
      toggleSnap();
    } else if (e.key == "1" && !formFocused) {
      drawMode = "append-start";
    } else if (e.key == "2" && !formFocused) {
      drawMode = "append-end";
    } else if (e.key == "3" && !formFocused) {
      drawMode = "adjust";
    }
  }
</script>

<div style="display: flex">
  <TinyRadio
    choices={[
      ["snap", "Snap to roads"],
      ["free", "Draw anywhere"],
    ]}
    value={$snapMode ? "snap" : "free"}
    on:change={toggleSnap}
  />

  <TinyRadio
    choices={[
      ["append-start", "Extend from start"],
      ["append-end", "Extend from end"],
      ["adjust", "Drag middle points"],
    ]}
    bind:value={drawMode}
  />

  <fieldset class="govuk-fieldset">
    <div class="govuk-checkboxes--small" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input
          type="checkbox"
          class="govuk-checkboxes__input"
          id={checkboxId}
          bind:checked={$showAllNodes}
        />
        <label
          class="govuk-label govuk-checkboxes__label"
          for={checkboxId}
          style="max-width: 100%"
        >
          Show all snappable points (zoom in to see)
        </label>
      </div>
    </div>
  </fieldset>

  <div style="margin-left: auto">
    <FixedButtonGroup>
      <DefaultButton on:click={finish} style="margin-bottom: 0px">
        Finish
      </DefaultButton>
      <SecondaryButton
        disabled={$undoLength == 0}
        on:click={undo}
        noBottomMargin
      >
        {#if $undoLength == 0}
          Undo
        {:else}
          Undo ({$undoLength})
        {/if}
      </SecondaryButton>
      <SecondaryButton on:click={cancel} noBottomMargin>Cancel</SecondaryButton>
      <HelpButton>
        <ul>
          <li>
            <b>Click</b>
            the map to add points
          </li>
          <li>
            Press <b>s</b>
            to switch between snapping points to existing roads and drawing anywhere
          </li>
          <li>
            <b>Click and drag</b>
            any point to move it
          </li>
          <li>
            <b>Click</b>
            a waypoint to delete it
          </li>
          <li>
            Press <b>Control+Z</b>
            to undo your last change
          </li>
          <li>
            Press <b>Enter</b>
            or
            <b>double click</b>
            to finish
          </li>
          <li>
            Press <b>Escape</b>
            to cancel
          </li>
        </ul>
      </HelpButton>
    </FixedButtonGroup>
  </div>
</div>

<svelte:window on:keydown={keyDown} />

<MapEvents on:click={onMapClick} on:mousemove={onMouseMove} />

{#each extraNodes as node}
  <Marker draggable bind:lngLat={node.point} on:dragend={() => addNode(node)}>
    <span class="dot node">{node.insertIdx}</span>
  </Marker>
{/each}

{#each $waypoints as waypt, idx}
  <Marker
    draggable
    bind:lngLat={waypt.point}
    on:click={() => toggleSnapped(idx)}
    on:contextmenu={() => removeWaypoint(idx)}
    on:mouseenter={() => (hoveringOnMarker = true)}
    on:mouseleave={() => (hoveringOnMarker = false)}
    on:dragstart={() => (draggingMarker = true)}
    on:dragend={() => (draggingMarker = false)}
  >
    <span class="dot" class:snapped={waypt.snapped}>{idx + 1}</span>
  </Marker>
{/each}

<GeoJSON data={routesGj} generateId>
  <LineLayer
    manageHoverState
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
</style>
