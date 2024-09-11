<script lang="ts">
  import { routeTool, userSettings } from "$lib/draw/stores";
  import { Checkbox, CheckboxGroup, SecondaryButton } from "govuk-svelte";
  import GeocoderControls from "./GeocoderControls.svelte";
  import { snapMode, undoLength, showAllNodes, showAllNodesGj } from "./stores";

  export let maptilerApiKey: string;
  // Start with this enabled or disabled, based on whether we're drawing a new
  // route or editing an existing.
  export let extendRoute: boolean;

  // TODO When editing, we should save in the route and use the previous value
  $: $routeTool!.setRouteConfig({
    avoid_doubling_back: false,
    extend_route: extendRoute,
  });

  function undo() {
    $routeTool!.undo();
  }

  function toggleSnap() {
    $routeTool!.toggleSnapMode();
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
</script>

<SecondaryButton disabled={$undoLength == 0} on:click={undo}>
  {#if $undoLength == 0}
    Undo
  {:else}
    Undo ({$undoLength})
  {/if}
</SecondaryButton>

{#if $snapMode}
  <p style="background: red; color: white; padding: 8px;">
    Snapping to existing roads. Press <b>s</b>
    or click below to draw anywhere
  </p>
  <SecondaryButton on:click={toggleSnap}>Draw anywhere</SecondaryButton>
{:else}
  <p style="background: blue; color: white; padding: 8px;">
    Drawing points anywhere. Press <b>s</b>
    or click below to snap to roads
  </p>
  <SecondaryButton on:click={toggleSnap}>Snap to roads</SecondaryButton>
{/if}

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

<CheckboxGroup small>
  <Checkbox
    bind:checked={extendRoute}
    hint="Keep clicking to add more points to the end of the route"
  >
    Add points to end
  </Checkbox>

  <Checkbox bind:checked={$showAllNodes}>
    Show all snappable points (zoom in to see)
  </Checkbox>
</CheckboxGroup>

{#if maptilerApiKey}
  <GeocoderControls {maptilerApiKey} />
{/if}
