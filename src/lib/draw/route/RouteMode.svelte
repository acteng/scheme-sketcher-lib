<script lang="ts" generics="F, S">
  import type { Feature, LineString, Polygon } from "geojson";
  import {
    mode,
    newFeatureId,
    getArbitrarySchemeRef,
    routeTool,
  } from "$lib/draw/stores";
  import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy, onMount } from "svelte";
  import RouteControls from "./RouteControls.svelte";
  import { type Config } from "$lib/config";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { waypoints } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  onMount(() => {});
  onDestroy(() => {
    $waypoints = [];
  });

  function onSuccess(feature: Feature<LineString | Polygon>) {
    let f = feature as FeatureWithID<F, LineString>;
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
    if (!$routeTool) {
      return;
    }
    $routeTool.inner.editExisting(
      $waypoints.map((w) => {
        return {
          lon: w.point[0],
          lat: w.point[1],
          snapped: w.snapped,
        };
      }),
    );
    let out = $routeTool.inner.toFinalFeature();
    if (out) {
      onSuccess(JSON.parse(out));
    }
  }
</script>

<ButtonGroup>
  <DefaultButton on:click={finish}>Finish</DefaultButton>
  <SecondaryButton on:click={onFailure}>Cancel</SecondaryButton>
</ButtonGroup>

<RouteControls maptilerApiKey={cfg.maptilerApiKey} extendRoute />
