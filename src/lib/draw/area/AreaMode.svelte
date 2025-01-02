<script lang="ts" generics="F, S">
  import { type Config } from "$lib/config";
  import {
    cancelCurrentFeature,
    featureProps,
    finishCurrentFeature,
    getArbitrarySchemeRef,
    mode,
    newFeatureId,
    routeTool,
  } from "$lib/draw/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Feature, LineString, Polygon } from "geojson";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import AreaControls from "./AreaControls.svelte";
  import { calculateArea, waypoints } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    $waypoints = [];
    finishCurrentFeature.set(finish);
    cancelCurrentFeature.set(onFailure);
  });

  onDestroy(() => {
    finishCurrentFeature.set(() => {});
    cancelCurrentFeature.set(() => {});
  });

  function onSuccess(feature: Feature<LineString | Polygon>) {
    let f = feature as FeatureWithID<F, Polygon>;
    f.properties = { ...f.properties, ...$featureProps };
    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference ||= getArbitrarySchemeRef(gj);
      cfg.newPolygonFeature(f);
      gj.features.push(f);
      return gj;
    });

    mode.set({ mode: "list" });
  }

  function onFailure() {
    mode.set({ mode: "list" });
  }

  function finish() {
    if (!$routeTool || $waypoints.length < 3) {
      return;
    }
    try {
      onSuccess(calculateArea($routeTool, $waypoints));
    } catch (err) {
      console.warn(`Finishing area failed: ${err}`);
    }
  }
</script>

<AreaControls {finish} cancel={onFailure} />
