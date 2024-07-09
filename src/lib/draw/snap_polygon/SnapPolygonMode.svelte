<script lang="ts">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    routeTool,
    newFeatureId,
    getArbitrarySchemeRef,
  } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import SnapPolygonControls from "./SnapPolygonControls.svelte";
  import { cfg } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";
  import type { SchemeCollection } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let gjSchemeCollection: Writable<SchemeCollection>;

  onMount(() => {
    $routeTool!.startArea();
    $routeTool!.addEventListenerSuccess(onSuccess);
    $routeTool!.addEventListenerFailure(onFailure);
  });
  onDestroy(() => {
    $routeTool!.stop();
    $routeTool!.clearEventListeners();
  });

  function onSuccess(feature: Feature<LineString | Polygon>) {
    // We did startArea, so we know it's a Polygon
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
    $routeTool!.finish();
  }
</script>

<ButtonGroup>
  <DefaultButton on:click={finish}>Finish</DefaultButton>
  <SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>
</ButtonGroup>

<SnapPolygonControls />
