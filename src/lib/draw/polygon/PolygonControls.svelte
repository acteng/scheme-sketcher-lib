<script lang="ts">
  import { polygonTool } from "$lib/draw/stores";
  import { DefaultButton, ButtonGroup, SecondaryButton } from "govuk-svelte";
  import { undoLength } from "maplibre-draw-polygon";
  import { HelpButton } from "$lib/common";

  export let finish: () => void;
  export let cancel: () => void;

  function undo() {
    $polygonTool!.undo();
  }
</script>

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
        the map to add a vertex
      </li>
      <li>
        <b>Click</b>
        a vertex to delete it
      </li>
      <li>
        <b>Drag</b>
        a vertex or the polygon to move it
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
