<script lang="ts">
  import { routeTool, userSettings } from "$lib/draw/stores";
  import { SecondaryButton, Radio, DefaultButton } from "govuk-svelte";
  import { snapMode, undoLength } from "./stores";
  import { HelpButton } from "$lib/common";
  import TinyRadio from "../TinyRadio.svelte";
  import { v4 as uuidv4 } from "uuid";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  // Start with this enabled or disabled, based on whether we're drawing a new
  // route or editing an existing.
  export let extendRoute: boolean;

  export let finish: () => void;
  export let cancel: () => void;

  let checkboxId = uuidv4();

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
          id={checkboxId}
          bind:checked={extendRoute}
        />
        <label
          class="govuk-label govuk-checkboxes__label"
          for={checkboxId}
          style="max-width: 100%"
        >
          Add points to end
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
