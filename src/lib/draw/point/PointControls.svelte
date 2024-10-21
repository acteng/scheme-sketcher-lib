<script lang="ts">
  import HelpModal from "../HelpModal.svelte";
  import { ButtonGroup, SecondaryButton } from "govuk-svelte";

  export let editingExisting: boolean;
  export let cancel: () => void;
</script>

<ButtonGroup>
  <SecondaryButton on:click={cancel}>Cancel</SecondaryButton>

  <HelpModal>
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
  </HelpModal>
</ButtonGroup>
