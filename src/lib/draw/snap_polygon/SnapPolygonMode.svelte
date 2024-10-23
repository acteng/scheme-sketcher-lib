<script lang="ts" generics="F, S">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    routeTool,
    newFeatureId,
    getArbitrarySchemeRef,
    newFeatureProps,
  } from "$lib/draw/stores";
  import { onDestroy, onMount } from "svelte";
  import SnapPolygonControls from "./SnapPolygonControls.svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

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
    let f = feature as FeatureWithID<F, Polygon>;
    f.properties = { ...f.properties, ...$newFeatureProps };
    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
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
    $routeTool!.finish();
  }
</script>

<SnapPolygonControls {finish} cancel={onFailure} />
