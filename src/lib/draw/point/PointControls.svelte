<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import ToolControls from "../ToolControls.svelte";

  export let editingExisting: boolean;
  export let cancel: () => void;
</script>

<ToolControls>
  <div class="govuk-button-group">
    <DefaultButton style="margin-bottom: 0px">Finish</DefaultButton>

    <SecondaryButton on:click={cancel} noBottomMargin>Cancel</SecondaryButton>

    <HelpButton>
      <ul>
        {#if editingExisting}
          <li>Click to move the point here</li>
        {:else}
          <li>Click to add a new point</li>
        {/if}
        <li>
          Press <b>Escape</b>
          to cancel
        </li>
      </ul>
    </HelpButton>
  </div>
</ToolControls>

<style>
  .govuk-button-group {
    margin-right: 0;
    flex-wrap: nowrap;
  }
</style>
