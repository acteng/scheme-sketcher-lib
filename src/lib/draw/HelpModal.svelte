<script lang="ts">
  import { SecondaryButton } from "govuk-svelte";
  import { Modal } from "$lib/common";

  let open = false;
</script>

<Modal title="Help" bind:open>
  <slot />
</Modal>

<SecondaryButton on:click={() => (open = true)}>Help</SecondaryButton>
