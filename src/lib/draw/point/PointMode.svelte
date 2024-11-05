<script lang="ts" generics="F, S">
  import type { Point } from "geojson";
  import {
    mode,
    newFeatureId,
    getArbitrarySchemeRef,
    featureProps,
  } from "$lib/draw/stores";
  import { onMount, onDestroy } from "svelte";
  import PointControls from "./PointControls.svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID } from "$lib/draw/types";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { position, isActive } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    $isActive = true;
  });
  onDestroy(() => {
    $isActive = false;
    $position = null;
  });

  function keyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onFailure();
    }
  }

  function onSuccess() {
    if (!$position) {
      return;
    }
    let f = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: JSON.parse(JSON.stringify($position)),
      },
      properties: { ...$featureProps },
    } as FeatureWithID<F, Point>;

    gjSchemes.update((gj) => {
      f.id = newFeatureId(gj);
      f.properties.scheme_reference = getArbitrarySchemeRef(gj);
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

<svelte:window on:keydown={keyDown} />

<PointControls editingExisting={false} finish={onSuccess} cancel={onFailure} />
