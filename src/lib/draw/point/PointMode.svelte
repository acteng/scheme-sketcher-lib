<script lang="ts" generics="F, S">
  import { map, type Config } from "$lib/config";
  import {
    cancelCurrentFeature,
    featureProps,
    finishCurrentFeature,
    getArbitrarySchemeRef,
    mode,
    newFeatureId,
    pointPosition,
    setPrecision,
  } from "$lib/draw/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Point } from "geojson";
  import { onDestroy, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import PointControls from "./PointControls.svelte";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    if ($map) {
      $map.getCanvas().style.cursor = "crosshair";
    }
    finishCurrentFeature.set(onSuccess);
    cancelCurrentFeature.set(onFailure);
  });

  onDestroy(() => {
    $pointPosition = null;
    cancelCurrentFeature.set(() => {});
    finishCurrentFeature.set(() => {});
    if ($map) {
      $map.getCanvas().style.cursor = "inherit";
    }
  });

  $: if ($pointPosition && $map) {
    $map.getCanvas().style.cursor = "inherit";
  }

  function onSuccess() {
    if (!$pointPosition) {
      return;
    }
    let f = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: setPrecision($pointPosition),
      },
      properties: { ...$featureProps },
    } as FeatureWithID<F, Point>;

    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference ||= getArbitrarySchemeRef(gj);
      cfg.newPointFeature(f);
      gj.features.push(f);
      return gj;
    });

    mode.set({ mode: "list" });
  }

  function onFailure() {
    mode.set({ mode: "list" });
  }
</script>

<PointControls finish={onSuccess} cancel={onFailure} />
