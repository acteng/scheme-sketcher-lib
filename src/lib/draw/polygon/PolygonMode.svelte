<script lang="ts">
  import type { Feature, Polygon } from "geojson";
  import {
    mode,
    polygonTool,
    newFeatureId,
    getArbitrarySchemeRef,
  } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import PolygonControls from "./PolygonControls.svelte";
  import { cfg } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";
  import type { SchemeCollection } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let gjSchemeCollection: Writable<SchemeCollection>;

  onMount(() => {
    $polygonTool!.startNew();
    $polygonTool!.addEventListenerSuccess(onSuccess);
    $polygonTool!.addEventListenerFailure(onFailure);
  });
  onDestroy(() => {
    $polygonTool!.stop();
    $polygonTool!.clearEventListeners();
  });

  function onSuccess(feature: Feature<Polygon>) {
    let f = feature as FeatureWithID<Polygon>;
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      cfg.newPolygonFeature(f);
      gj.features.push(f);
      return gj;
    });

    mode.set({ mode: "edit-form", id: f.id as number });
  }

  function onFailure() {
    mode.set({ mode: "list" });
  }

  function finish() {
    $polygonTool!.finish();
  }
</script>

<ButtonGroup>
  <DefaultButton on:click={finish}>Finish</DefaultButton>
  <SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>
</ButtonGroup>

<PolygonControls />
