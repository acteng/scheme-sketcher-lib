<script lang="ts" generics="F, S">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    routeTool,
    newFeatureId,
    getArbitrarySchemeRef,
    newFeatureProps,
  } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import RouteControls from "./RouteControls.svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    $routeTool!.startRoute();
    $routeTool!.addEventListenerSuccess(onSuccess);
    $routeTool!.addEventListenerFailure(onFailure);
  });
  onDestroy(() => {
    $routeTool!.stop();
    $routeTool!.clearEventListeners();
  });

  function onSuccess(feature: Feature<LineString | Polygon>) {
    let f = feature as FeatureWithID<F, LineString>;
    f.properties = { ...f.properties, ...$newFeatureProps };
    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
      cfg.newLineStringFeature(f);
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

<RouteControls
  maptilerApiKey={cfg.maptilerApiKey}
  extendRoute
  {finish}
  cancel={onFailure}
/>
