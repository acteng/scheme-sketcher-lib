<script lang="ts">
  import type { Feature, Point } from "geojson";
  import {
    mode,
    pointTool,
    newFeatureId,
    getArbitrarySchemeRef,
  } from "$lib/draw/stores";
  import { SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import PointControls from "./PointControls.svelte";
  import { cfg } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";
  import type { SchemeCollection } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let gjSchemeCollection: Writable<SchemeCollection>;

  onMount(() => {
    $pointTool!.start();
    $pointTool!.addEventListenerSuccess(onSuccess);
    $pointTool!.addEventListenerFailure(onFailure);
  });
  onDestroy(() => {
    $pointTool!.stop();
    $pointTool!.clearEventListeners();
  });

  function onSuccess(feature: Feature<Point>) {
    let f = feature as FeatureWithID<Point>;
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      cfg.newPointFeature(f);
      gj.features.push(f);
      return gj;
    });

    mode.set({ mode: "edit-form", id: f.id as number });
  }

  function onFailure() {
    mode.set({ mode: "list" });
  }
</script>

<SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>

<PointControls editingExisting={false} />
