<script>import { mode, pointTool } from "../stores";
import { SecondaryButton } from "govuk-svelte";
import { onDestroy, onMount } from "svelte";
import PointControls from "./PointControls.svelte";
import { cfg } from "../../config";
onMount(() => {
  $pointTool.start();
  $pointTool.addEventListenerSuccess(onSuccess);
  $pointTool.addEventListenerFailure(onFailure);
});
onDestroy(() => {
  $pointTool.stop();
  $pointTool.clearEventListeners();
});
function onSuccess(feature) {
  cfg.newPointFeature(feature);
  mode.set({ mode: "edit-form", id: feature.id });
}
function onFailure() {
  mode.set({ mode: "list" });
}
</script>

<SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>

<PointControls editingExisting={false} />
