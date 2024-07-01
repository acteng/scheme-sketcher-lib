<script>import { StreetViewHelp, StreetViewTool } from "../common";
import { mode, userSettings } from "./stores";
import { DefaultButton, Radio } from "govuk-svelte";
let enabled = true;
$:
  if (!enabled) {
    mode.set({ mode: "list" });
  }
</script>

<StreetViewTool bind:enabled showControls={false} />

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
