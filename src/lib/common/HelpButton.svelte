<script lang="ts">
  // This launches a modal when clicked. The user should put the modal contents
  // as a slot beneath this component.
  import icon from "$lib/assets/help.svg";
  import { Modal } from ".";

  let open = false;

  // TODO Figure out style recommendations. SecondaryButton doesn't look good.
</script>

<button on:click={() => (open = true)}>
  <img src={icon} title="Help" alt="Help" />
</button>

<Modal title="Help" bind:open>
  <div class="govuk-prose">
    <slot />
  </div>
</Modal>

<style>
  button {
    background: none;
    border: 1px solid rgba(0, 0, 0, 0);
  }

  button:hover {
    border: 1px solid black;
  }
</style>
