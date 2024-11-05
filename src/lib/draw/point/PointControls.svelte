<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  export let editingExisting: boolean;
  export let finish: () => void;
  export let cancel: () => void;
</script>

<div style="float: right">
  <FixedButtonGroup>
    <DefaultButton on:click={finish} style="margin-bottom: 0px">
      Finish
    </DefaultButton>
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
