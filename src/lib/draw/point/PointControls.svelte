<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { SecondaryButton } from "govuk-svelte";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  export let editingExisting: boolean;
  export let cancel: () => void;
</script>

<div style="float: right">
  <FixedButtonGroup>
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
  </FixedButtonGroup>
</div>
