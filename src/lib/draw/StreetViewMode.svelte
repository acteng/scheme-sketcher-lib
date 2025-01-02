<script lang="ts" generics="F, S">
  import { HelpButton, StreetViewHelp, StreetViewTool } from "$lib/common";
  import { map, type Config } from "$lib/config";
  import { mode, userSettings } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, Radio } from "govuk-svelte";
  import FixedButtonGroup from "./FixedButtonGroup.svelte";
  import TinyRadio from "./TinyRadio.svelte";

  export let cfg: Config<F, S>;

  let enabled = true;
  $: if (!enabled) {
    mode.set({ mode: "list" });
  }
</script>

<StreetViewTool {cfg} map={$map} bind:enabled showControls={false} />

<div style="display: flex">
  <TinyRadio
    choices={[
      ["google", "Google Street View"],
      ["bing", "Bing Streetside"],
    ]}
    bind:value={$userSettings.streetViewImagery}
  />

  <div style="margin-left: auto">
    <FixedButtonGroup>
      <DefaultButton
        on:click={() => (enabled = false)}
        style="margin-bottom: 0px"
      >
        Finish
      </DefaultButton>
      <HelpButton>
        <StreetViewHelp />
      </HelpButton>
    </FixedButtonGroup>
  </div>
</div>
