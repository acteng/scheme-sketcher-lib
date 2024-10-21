<script lang="ts">
  import HelpModal from "../HelpModal.svelte";

  export let editingExisting: boolean;
</script>

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
