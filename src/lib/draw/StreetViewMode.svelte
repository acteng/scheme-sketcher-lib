<script lang="ts" generics="F, S">
  import { StreetViewHelp, StreetViewTool } from "$lib/common";
  import { mode, userSettings } from "$lib/draw/stores";
  import { DefaultButton, Radio } from "govuk-svelte";
  import type { Config } from "$lib/config";

  export let cfg: Config<F, S>;

  let enabled = true;
  $: if (!enabled) {
    mode.set({ mode: "list" });
  }
</script>

<StreetViewTool {cfg} bind:enabled showControls={false} />

<DefaultButton on:click={() => (enabled = false)}>Finish</DefaultButton>

<Radio
  legend="Source"
  choices={[
    ["google", "Google Street View"],
    ["bing", "Bing Streetside"],
  ]}
  bind:value={$userSettings.streetViewImagery}
  inlineSmall
/>

<StreetViewHelp />
