<script lang="ts">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    routeTool,
    newFeatureId,
    getArbitrarySchemeRef,
    gjSchemeCollection,
  } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import SnapPolygonControls from "./SnapPolygonControls.svelte";
  import { cfg } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";

  onMount(() => {
    $routeTool!.startArea();
    $routeTool!.addEventListenerSuccess(onSuccess);
    $routeTool!.addEventListenerFailure(onFailure);
  });
  onDestroy(() => {
    $routeTool!.stop();
    $routeTool!.clearEventListeners();
  });

  function onSuccess(f: Feature<LineString | Polygon>) {
    gjSchemeCollection.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties ||= {};
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      // We did startArea, so we know it's a Polygon
      cfg.newPolygonFeature(f as Feature<Polygon>);
      gj.features.push(f as FeatureWithID);
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
