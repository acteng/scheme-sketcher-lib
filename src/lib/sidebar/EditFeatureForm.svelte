<script lang="ts" generics="F, S">
  import {
    deleteIntervention,
    mode,
    featureProps,
    cancelCurrentFeature,
    finishCurrentFeature,
  } from "$lib/draw/stores";
  import {
    ErrorMessage,
    DefaultButton,
    SecondaryButton,
    WarningButton,
  } from "govuk-svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let id: number;

  let feature = $gjSchemes.features.find((f) => f.id == id)!;

  // Copy, since the form would otherwise immediately edit these
  $featureProps = JSON.parse(JSON.stringify(feature.properties));

  function onKeydown(e: KeyboardEvent) {
    if (e.key == "Delete") {
      const tag = (e.target as HTMLElement).tagName;
      // Let the delete key work in forms
      if (tag == "INPUT" || tag == "TEXTAREA") {
        return;
      }
      e.stopPropagation();

      deleteIntervention(gjSchemes, id);
    }
  }
</script>

<svelte:window on:keydown={onKeydown} />

<h2>Editing {cfg.interventionName(feature)}</h2>

<DefaultButton
  on:click={() => {
    $finishCurrentFeature();
  }}
>
  Finish
</DefaultButton>

<SecondaryButton
  on:click={() => {
    $cancelCurrentFeature();
  }}
>
  Cancel
</SecondaryButton>

<WarningButton on:click={() => deleteIntervention(gjSchemes, id)}>
  Delete
</WarningButton>

<ErrorMessage errorMessage={cfg.interventionWarning($featureProps)} />

<svelte:component
  this={cfg.editFeatureForm}
  {cfg}
  {gjSchemes}
  {id}
  bind:props={$featureProps}
/>
