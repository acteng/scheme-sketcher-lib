<script lang="ts">
  import { routeTool, userSettings } from "$lib/draw/stores";
  import {
    Checkbox,
    CheckboxGroup,
    SecondaryButton,
    Radio,
  } from "govuk-svelte";
  import GeocoderControls from "./GeocoderControls.svelte";
  import { snapMode, undoLength } from "./stores";
  import HelpModal from "../HelpModal.svelte";

  export let maptilerApiKey: string;
  // Start with this enabled or disabled, based on whether we're drawing a new
  // route or editing an existing.
  export let extendRoute: boolean;

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
</script>

<SecondaryButton disabled={$undoLength == 0} on:click={undo}>
  {#if $undoLength == 0}
    Undo
  {:else}
    Undo ({$undoLength})
  {/if}
</SecondaryButton>

<Radio
  label="Draw"
  choices={[
    ["snap", "Snap to roads"],
    ["free", "Draw anywhere"],
  ]}
  value={$snapMode ? "snap" : "free"}
  on:change={toggleSnap}
/>

<CheckboxGroup small>
  <Checkbox
    bind:checked={extendRoute}
    hint="Keep clicking to add more points to the end of the route"
  >
    Add points to end
  </Checkbox>
</CheckboxGroup>

{#if maptilerApiKey}
  <GeocoderControls {maptilerApiKey} />
{/if}

<HelpModal>
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
</HelpModal>
