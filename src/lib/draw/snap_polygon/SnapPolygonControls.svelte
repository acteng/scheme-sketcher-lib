<script lang="ts">
  import { routeTool } from "$lib/draw/stores";
  import { DefaultButton, SecondaryButton, Checkbox } from "govuk-svelte";
  import { undoLength, showAllNodes, showAllNodesGj } from "../route/stores";
  import { HelpButton } from "$lib/common";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  export let finish: () => void;
  export let cancel: () => void;

  function undo() {
    $routeTool!.undo();
  }

  function loadNodes(show: boolean) {
    if (show && $showAllNodesGj.features.length == 0) {
      $showAllNodesGj = JSON.parse($routeTool!.inner.debugSnappableNodes());
    }
  }
  $: loadNodes($showAllNodes);
</script>

<div style="float: right">
  <Checkbox bind:checked={$showAllNodes}>
    Show all snappable points (zoom in to see)
  </Checkbox>

  <FixedButtonGroup>
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
    </HelpButton>
  </FixedButtonGroup>
</div>
