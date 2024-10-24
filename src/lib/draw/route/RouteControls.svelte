<script lang="ts">
  import { routeTool, userSettings } from "$lib/draw/stores";
  import {
    Checkbox,
    CheckboxGroup,
    SecondaryButton,
    Radio,
    DefaultButton,
    ButtonGroup,
  } from "govuk-svelte";
  import { snapMode, undoLength } from "./stores";
  import { HelpButton } from "$lib/common";

  // Start with this enabled or disabled, based on whether we're drawing a new
  // route or editing an existing.
  export let extendRoute: boolean;

  export let finish: () => void;
  export let cancel: () => void;

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

<div style="display: flex;">
  <Radio
    label="Draw"
    choices={[
      ["snap", "Snap to roads"],
      ["free", "Draw anywhere"],
    ]}
    value={$snapMode ? "snap" : "free"}
    on:change={toggleSnap}
    inlineSmall
    leftLabel
  />

  <CheckboxGroup small>
    <Checkbox
      bind:checked={extendRoute}
      hint="Keep clicking to add more points to the end of the route"
    >
      Add points to end
    </Checkbox>
  </CheckboxGroup>

  <div style="margin-left: auto">
    <ButtonGroup>
      <DefaultButton on:click={finish}>Finish</DefaultButton>
      <SecondaryButton disabled={$undoLength == 0} on:click={undo}>
        {#if $undoLength == 0}
          Undo
        {:else}
          Undo ({$undoLength})
        {/if}
      </SecondaryButton>
      <SecondaryButton on:click={cancel}>Cancel</SecondaryButton>
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
    </ButtonGroup>
  </div>
</div>
