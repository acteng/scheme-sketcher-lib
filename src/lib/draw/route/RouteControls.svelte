<script lang="ts">
  import { routeTool, userSettings } from "$lib/draw/stores";
  import { snapMode, undoLength, showAllNodes, showAllNodesGj } from "./stores";
  import { HelpButton } from "$lib/common";
  import TinyRadio from "../TinyRadio.svelte";
  import { v4 as uuidv4 } from "uuid";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";

  // Start with this enabled or disabled, based on whether we're drawing a new
  // route or editing an existing.
  export let extendRoute: boolean;

  export let finish: () => void;
  export let cancel: () => void;

  let checkbox1Id = uuidv4();
  let checkbox2Id = uuidv4();

  $: $routeTool!.setRouteConfig({
    avoid_doubling_back: false,
    extend_route: extendRoute,
  });

  function undo() {
    $routeTool!.undo();
  }

  function toggleSnap() {
    $snapMode = !$snapMode;
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

<div style="display: flex">
  <TinyRadio
    choices={[
      ["snap", "Snap to roads"],
      ["free", "Draw anywhere"],
    ]}
    value={$snapMode ? "snap" : "free"}
    on:change={toggleSnap}
  />

  <fieldset class="govuk-fieldset">
    <div class="govuk-checkboxes--small" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input
          type="checkbox"
          class="govuk-checkboxes__input"
          id={checkbox1Id}
          bind:checked={extendRoute}
        />
        <label
          class="govuk-label govuk-checkboxes__label"
          for={checkbox1Id}
          style="max-width: 100%"
        >
          Add points to end
        </label>
      </div>

      <div class="govuk-checkboxes__item">
        <input
          type="checkbox"
          class="govuk-checkboxes__input"
          id={checkbox2Id}
          bind:checked={$showAllNodes}
        />
        <label
          class="govuk-label govuk-checkboxes__label"
          for={checkbox2Id}
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
