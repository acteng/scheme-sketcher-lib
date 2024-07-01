<script>import {
  deleteIntervention,
  gjSchemeCollection,
  mode
} from "../draw/stores";
import {
  ButtonGroup,
  DefaultButton,
  ErrorMessage,
  SecondaryButton,
  WarningButton
} from "govuk-svelte";
import { map, cfg } from "../config";
import { onDestroy, onMount } from "svelte";
export let id;
let feature = $gjSchemeCollection.features.find((f) => f.id == id);
function featureUpdated(feature2) {
  $gjSchemeCollection = $gjSchemeCollection;
}
$:
  featureUpdated(feature);
onMount(() => {
  $map?.on("click", onClick);
});
onDestroy(() => {
  $map?.off("click", onClick);
});
function onClick(e) {
  for (let f of $map.queryRenderedFeatures(e.point, {
    layers: [
      "interventions-points",
      "interventions-lines",
      "interventions-polygons"
    ]
  })) {
    if (f.id == id) {
      return;
    }
  }
  mode.set({ mode: "list" });
}
function onKeydown(e) {
  if (e.key == "Escape") {
    e.stopPropagation();
    mode.set({ mode: "list" });
    return;
  }
  if (e.key == "Delete") {
    const tag = e.target.tagName;
    if (tag == "INPUT" || tag == "TEXTAREA") {
      return;
    }
    e.stopPropagation();
    deleteIntervention(id);
  }
  if (e.key == "e") {
    const tag = e.target.tagName;
    if (tag == "INPUT" || tag == "TEXTAREA") {
      return;
    }
    e.stopPropagation();
    mode.set({ mode: "edit-geometry", id });
  }
}
</script>

<svelte:window on:keydown={onKeydown} />

<h2>Editing {cfg.interventionName(feature)}</h2>

<ButtonGroup>
  <DefaultButton on:click={() => mode.set({ mode: "list" })}>
    Save
  </DefaultButton>
  <SecondaryButton on:click={() => mode.set({ mode: "edit-geometry", id })}>
    Edit geometry
  </SecondaryButton>
  <WarningButton on:click={() => deleteIntervention(id)}>Delete</WarningButton>
</ButtonGroup>

<!--<ErrorMessage errorMessage={warning} />
{#if $schema == "v1"}
  <UnexpectedProperties id={feature.id} props={feature.properties} />
  <FormV1 bind:props={feature.properties} />
{:else if $schema == "pipeline"}
  <UnexpectedProperties id={feature.id} props={feature.properties} />
  <PipelineForm bind:props={feature.properties} />
{/if}-->
