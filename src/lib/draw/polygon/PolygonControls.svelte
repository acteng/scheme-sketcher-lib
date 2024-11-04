<script lang="ts">
  import { polygonTool } from "$lib/draw/stores";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import { undoLength } from "maplibre-draw-polygon";
  import { HelpButton } from "$lib/common";
  import ToolControls from "../ToolControls.svelte";

  export let finish: () => void;
  export let cancel: () => void;

  function undo() {
    $polygonTool!.undo();
  }
</script>

<ToolControls>
  <div style="float: right">
    <div class="govuk-button-group">
      <DefaultButton on:click={finish} style="margin-bottom: 0px">
        Finish
      </DefaultButton>

      <SecondaryButton
        disabled={$undoLength == 0}
        on:click={undo}
        style="margin-bottom: 0px"
      >
        {#if $undoLength == 0}
          Undo
        {:else}
          Undo ({$undoLength})
        {/if}
      </SecondaryButton>

      <SecondaryButton on:click={cancel} style="margin-bottom: 0px">
        Cancel
      </SecondaryButton>

      <HelpButton>
        <ul>
          <li>
            <b>Click</b>
            the map to add a point
          </li>
          <li>
            <b>Click</b>
            a point to delete it
          </li>
          <li>
            <b>Drag</b>
            a point or the area to move it
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
    </div>
  </div>
</ToolControls>

<style>
  .govuk-button-group {
    margin-right: 0;
    flex-wrap: nowrap;
  }
</style>
