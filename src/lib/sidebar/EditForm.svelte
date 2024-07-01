<script lang="ts">
  import {
    deleteIntervention,
    gjSchemeCollection,
    mode,
  } from "$lib/draw/stores";
  import {
    ButtonGroup,
    DefaultButton,
    ErrorMessage,
    SecondaryButton,
    WarningButton,
  } from "govuk-svelte";
  import type { MapMouseEvent } from "maplibre-gl";
  import { map, cfg } from "$lib/config";
  import { onDestroy, onMount } from "svelte";
  import type { FeatureWithAnyProps } from "$lib/draw/types";

  export let id: number;

  let feature = $gjSchemeCollection.features.find((f) => f.id == id)!;

  // Because of how properties are bound individually, updates to $gjScheme aren't seen. Force them.
  function featureUpdated(feature: FeatureWithAnyProps) {
    $gjSchemeCollection = $gjSchemeCollection;
  }
  $: featureUpdated(feature);

  // TODO Does MapEvents work?
  onMount(() => {
    $map?.on("click", onClick);
  });
  onDestroy(() => {
    $map?.off("click", onClick);
  });

  function onClick(e: MapMouseEvent) {
    // As long as we didn't click the feature we're editing, exit this mode
    for (let f of $map!.queryRenderedFeatures(e.point, {
      layers: [
        "interventions-points",
        "interventions-lines",
        "interventions-polygons",
      ],
    })) {
      if (f.id == id) {
        return;
      }
    }
    mode.set({ mode: "list" });
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      e.stopPropagation();
      mode.set({ mode: "list" });
      return;
    }

    if (e.key == "Delete") {
      const tag = (e.target as HTMLElement).tagName;
      // Let the delete key work in forms
      if (tag == "INPUT" || tag == "TEXTAREA") {
        return;
      }
      e.stopPropagation();

      deleteIntervention(id);
    }

    if (e.key == "e") {
      const tag = (e.target as HTMLElement).tagName;
      // Don't interrupt forms
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

<ErrorMessage errorMessage={cfg.interventionWarning(feature)} />

<!--{#if $schema == "v1"}
  <UnexpectedProperties id={feature.id} props={feature.properties} />
  <FormV1 bind:props={feature.properties} />
{:else if $schema == "pipeline"}
  <UnexpectedProperties id={feature.id} props={feature.properties} />
  <PipelineForm bind:props={feature.properties} />
{/if}-->
