<script>import { mode, routeTool } from "../stores";
import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
import { onDestroy, onMount } from "svelte";
import RouteControls from "./RouteControls.svelte";
import { cfg } from "../../config";
onMount(() => {
  $routeTool.startRoute();
  $routeTool.addEventListenerSuccess(onSuccess);
  $routeTool.addEventListenerFailure(onFailure);
});
onDestroy(() => {
  $routeTool.stop();
  $routeTool.clearEventListeners();
});
function onSuccess(feature) {
  cfg.newLineStringFeature(feature);
  mode.set({ mode: "edit-form", id: feature.id });
}
function onFailure() {
  mode.set({ mode: "list" });
}
function finish() {
  $routeTool.finish();
}
</script>

<ButtonGroup>
  <DefaultButton on:click={finish}>Finish</DefaultButton>
  <SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>
</ButtonGroup>

<RouteControls extendRoute />
