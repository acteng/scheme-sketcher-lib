<script lang="ts">
  import { mode } from "./stores";
  import type { Mode } from "./types";

  export let setMode: Mode;
  export let disabled = false;
</script>

<button
  type="button"
  class="govuk-button govuk-button--secondary"
  data-module="govuk-button"
  on:click={() => mode.set(setMode)}
  disabled={disabled || $mode.mode != "list"}
  style:margin-bottom={$mode.mode == "list" ? "0px" : "8px"}
  class:focused={$mode.mode == setMode.mode}
>
  <slot />
</button>

<style>
  /* Mimicking the govuk-button:focus style, but activating also for a
   * keybinding, not just clicking */
  .focused {
    outline: 3px solid #fd0;
  }
</style>
