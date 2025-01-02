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
  import { onDestroy, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import RouteControls from "./RouteControls.svelte";
  import { waypoints } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    $waypoints = [];
    cancelCurrentFeature.set(onFailure);
    finishCurrentFeature.set(finish);
  });

  onDestroy(() => {
    cancelCurrentFeature.set(() => {});
    finishCurrentFeature.set(() => {});
  });

  function onSuccess(feature: Feature<LineString | Polygon>) {
    let f = feature as FeatureWithID<F, LineString>;
    f.properties = { ...f.properties, ...$featureProps };
    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference ||= getArbitrarySchemeRef(gj);
      cfg.newLineStringFeature(f);
      gj.features.push(f);
      return gj;
    });

    mode.set({ mode: "list" });
  }

  function onFailure() {
    mode.set({ mode: "list" });
  }

  function finish() {
    if (!$routeTool) {
      return;
    }
    try {
      let out = $routeTool.inner.calculateRoute($waypoints);
      onSuccess(JSON.parse(out));
    } catch (err) {
      console.warn(`Finishing route failed: ${err}`);
    }
  }
</script>

<RouteControls {finish} cancel={onFailure} editingExisting={false} />
