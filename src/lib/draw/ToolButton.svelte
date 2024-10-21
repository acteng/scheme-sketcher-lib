<script lang="ts">
  import { IconButton } from "govuk-svelte";
  import { mode } from "./stores";
  import type { Mode } from "./types";

  export let setMode: Mode;
  export let disabled = false;
</script>

<IconButton
  on:click={() => mode.set(setMode)}
  disabled={disabled || $mode.mode != "list"}
>
  {#if $mode == setMode}
    <b><slot /></b>
  {:else}
    <slot />
  {/if}
</IconButton>
