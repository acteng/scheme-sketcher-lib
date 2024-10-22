<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { ButtonGroup, SecondaryButton } from "govuk-svelte";

  export let editingExisting: boolean;
  export let cancel: () => void;
</script>

<div style="float: right">
  <ButtonGroup>
    <SecondaryButton on:click={cancel}>Cancel</SecondaryButton>

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
  </ButtonGroup>
</div>
