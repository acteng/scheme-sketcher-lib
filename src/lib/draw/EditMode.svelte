<script lang="ts" generics="F, S">
  import type { Feature, LineString, Point, Polygon } from "geojson";
  import {
    mode,
    polygonTool,
    routeTool,
    featureProps,
    setPrecision,
  } from "$lib/draw/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import { type Config } from "$lib/config";
  import { onDestroy, onMount } from "svelte";
  import PointControls from "./point/PointControls.svelte";
  import { position } from "./point/stores";
  import PolygonControls from "./polygon/PolygonControls.svelte";
  import RouteControls from "./route/RouteControls.svelte";
  import SnapPolygonControls from "./snap_polygon/SnapPolygonControls.svelte";
  import type { AreaProps, RouteProps } from "route-snapper-ts";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let id: number;

  let controls = "";

  // As a feature is being edited, store the latest version
  let unsavedFeature: FeatureWithID<F> | null = null;

  onMount(() => {
    let maybeFeature: FeatureWithID<F> | null = null;
    gjSchemes.update((gj) => {
      maybeFeature = gj.features.find((f) => f.id == id)!;
      // Hide it from the regular drawing while we're editing
      maybeFeature.properties.hide_while_editing = true;
      return gj;
    });
    let feature = maybeFeature!;
    // Immediately copy the feature, so that if no geometry edits happen and
    // only form updates (through $featureProps), the edit is still used.
    unsavedFeature = JSON.parse(JSON.stringify(feature));

    if (feature.geometry.type == "LineString") {
      // TODO Update route-snapper-ts to use Except<route_name> or otherwise pick the important properties
      $routeTool?.editExistingRoute(
        feature as unknown as Feature<LineString, RouteProps>,
      );
      $routeTool?.addEventListenerSuccess(onSuccess);
      $routeTool?.addEventListenerUpdated(onUpdate);
      $routeTool?.addEventListenerFailure(onFailure);
      controls = "route";
    } else if (feature.geometry.type == "Polygon") {
      if (feature.properties.waypoints) {
        $routeTool?.editExistingArea(feature as Feature<Polygon, AreaProps>);
        $routeTool?.addEventListenerSuccess(onSuccess);
        $routeTool?.addEventListenerUpdated(onUpdate);
        $routeTool?.addEventListenerFailure(onFailure);
        controls = "snapped-polygon";
      } else {
        $polygonTool?.editExisting(feature as Feature<Polygon>);
        $polygonTool?.addEventListenerSuccess(onSuccess);
        $polygonTool?.addEventListenerUpdated(onUpdate);
        $polygonTool?.addEventListenerFailure(onFailure);
        controls = "freehand-polygon";
      }
    } else if (feature.geometry.type == "Point") {
      $position = JSON.parse(JSON.stringify(feature.geometry.coordinates));
      controls = "point";
    }
  });
  onDestroy(() => {
    if (controls == "point") {
      $position = null;
    }

    $routeTool?.stop();
    $routeTool?.clearEventListeners();

    $polygonTool?.stop();
    $polygonTool?.clearEventListeners();

    gjSchemes.update((gj) => {
      let featureToBeUpdated = gj.features.find((f) => f.id == id);
      // If the feature was deleted, stop
      if (!featureToBeUpdated) {
        return gj;
      }

      // Show the feature again
      delete featureToBeUpdated.properties.hide_while_editing;

      // Apply any updates to the feature. Failure / cancel cases will clear
      // out unsavedFeature.
      if (unsavedFeature) {
        updateFeature(featureToBeUpdated, unsavedFeature);
      }
      return gj;
    });
  });

  // Listen to updates for points
  $: updatePoint($position);
  function updatePoint(position: [number, number] | null) {
    if (unsavedFeature?.geometry.type == "Point" && position) {
      unsavedFeature.geometry.coordinates = setPrecision(position);
    }
  }

  function onSuccess(feature: Feature<Point | Polygon | LineString>) {
    feature.properties ??= {};
    // Let onDestroy apply the update
    unsavedFeature = feature as FeatureWithID<F>;
    mode.set({ mode: "list" });
  }

  function onUpdate(feature: Feature<Polygon | LineString>) {
    // Just remember the update; don't apply it yet
    // The cast is safe because the callers carry forward the ID and
    // properties passed in, and the input is valid.
    unsavedFeature = feature as FeatureWithID<F, Polygon | LineString>;
  }

  function onFailure() {
    // User canceled in the tool, so throw away unsaved updates
    unsavedFeature = null;
    mode.set({ mode: "list" });
  }

  // Copy geometry and properties from source to destination
  function updateFeature(
    destination: FeatureWithID<F>,
    source: FeatureWithID<F>,
  ) {
    destination.geometry = source.geometry;

    destination.properties = { ...$featureProps };

    // Copy properties that may come from routeTool. Not all tools or cases
    // will produce all of these.
    if (source.properties.length_meters) {
      destination.properties.length_meters = source.properties.length_meters;
    }
    if (source.properties.waypoints) {
      destination.properties.waypoints = source.properties.waypoints;
    }
    cfg.updateFeature(destination, source);
  }

  function finish() {
    mode.set({ mode: "list" });
  }

  function cancel() {
    unsavedFeature = null;
    mode.set({ mode: "list" });
  }
</script>

{#if controls == "point"}
  <PointControls {finish} {cancel} />
{:else if controls == "route"}
  <RouteControls extendRoute={false} {finish} {cancel} />
{:else if controls == "freehand-polygon"}
  <PolygonControls {finish} {cancel} />
{:else if controls == "snapped-polygon"}
  <SnapPolygonControls {finish} {cancel} />
{/if}
