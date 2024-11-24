<script lang="ts" generics="F, S">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    newFeatureId,
    getArbitrarySchemeRef,
    featureProps,
    routeTool,
  } from "$lib/draw/stores";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onMount } from "svelte";
  import AreaControls from "./AreaControls.svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { waypoints } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {
    $waypoints = [];
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
    if (!$routeTool) {
      return;
    }
    try {
      let out = JSON.parse($routeTool.inner.calculateRoute($waypoints));
      // TODO Somthing diff here
      out.geometry.type = "Polygon";
      out.geometry.coordinates.push(
        out.geometry.coordinates[out.geometry.coordinates.length - 1],
      );
      out.geometry.coordinates = [out.geometry.coordinates];
      onSuccess(out);
    } catch (err) {
      console.warn(`Finishing area failed: ${err}`);
    }
  }
</script>

<AreaControls {finish} cancel={onFailure} />
