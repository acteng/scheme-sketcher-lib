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
  class:focused={$mode == setMode}
>
  <slot />
</button>

<style>
  /* Manually copied govuk-button:focus */
  .focused {
    border-color: #fd0;
    outline: 3px solid transparent;
    box-shadow: inset 0 0 0 1px #fd0;
  }
</style>
