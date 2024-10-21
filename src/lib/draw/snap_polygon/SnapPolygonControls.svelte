<script lang="ts">
  import { routeTool } from "$lib/draw/stores";
  import { DefaultButton, ButtonGroup, SecondaryButton } from "govuk-svelte";
  import { undoLength } from "../route/stores";
  import HelpModal from "../HelpModal.svelte";

  export let finish: () => void;
  export let cancel: () => void;

  function undo() {
    $routeTool!.undo();
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

  <HelpModal>
    <ul>
      <li>
        <b>Click</b>
        the map to add points
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
</ButtonGroup>
