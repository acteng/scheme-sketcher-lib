<script lang="ts" generics="F, S">
  import { StreetViewHelp, StreetViewTool } from "$lib/common";
  import { mode, userSettings } from "$lib/draw/stores";
  import { DefaultButton, Radio } from "govuk-svelte";
  import { type Config, map } from "$lib/config";
  import { HelpButton } from "$lib/common";

  export let cfg: Config<F, S>;

  let enabled = true;
  $: if (!enabled) {
    mode.set({ mode: "list" });
  }
</script>

<StreetViewTool {cfg} map={$map} bind:enabled showControls={false} />

<div style="display: flex">
  <DefaultButton on:click={() => (enabled = false)}>Finish</DefaultButton>

  <Radio
    label="Source"
    choices={[
      ["google", "Google Street View"],
      ["bing", "Bing Streetside"],
    ]}
    bind:value={$userSettings.streetViewImagery}
    inlineSmall
  />

  <HelpButton>
    <StreetViewHelp />
  </HelpButton>
</div>
