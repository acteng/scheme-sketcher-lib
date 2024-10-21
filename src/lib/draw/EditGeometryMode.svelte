<script lang="ts" generics="F, S">
  import type { Feature, LineString, Point, Polygon } from "geojson";
  import { mode, pointTool, polygonTool, routeTool } from "$lib/draw/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import { type Config } from "$lib/config";
  import { onDestroy, onMount } from "svelte";
  import PointControls from "./point/PointControls.svelte";
  import PolygonControls from "./polygon/PolygonControls.svelte";
  import RouteControls from "./route/RouteControls.svelte";
  import SnapPolygonControls from "./snap_polygon/SnapPolygonControls.svelte";
  import type { AreaProps, RouteProps } from "route-snapper-ts";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let id: number;

  let name = "";
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
    name = cfg.interventionName(feature);

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
      // No need to pass in the existing feature.geometry; it's the same as
      // where the cursor is anyway
      $pointTool?.start();
      $pointTool?.addEventListenerSuccess(onSuccess);
      // No auto-save for updates
      $pointTool?.addEventListenerFailure(onFailure);
      controls = "point";
    }
  });
  onDestroy(() => {
    $pointTool?.stop();
    $pointTool?.clearEventListeners();

    $routeTool?.stop();
    $routeTool?.clearEventListeners();

    $polygonTool?.stop();
    $polygonTool?.clearEventListeners();

    gjSchemes.update((gj) => {
      let featureToBeUpdated = gj.features.find((f) => f.id == id)!;

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

  function onSuccess(feature: Feature<Point | Polygon | LineString>) {
    feature.properties ??= {};
    // Let onDestroy apply the update
    unsavedFeature = feature as FeatureWithID<F>;
    mode.set({ mode: "edit-form", id });
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
    mode.set({ mode: "edit-form", id });
  }

  // Copy geometry and properties from source to destination
  function updateFeature(
    destination: FeatureWithID<F>,
    source: FeatureWithID<F>,
  ) {
    destination.geometry = source.geometry;

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
    mode.set({ mode: "edit-form", id });
  }

  function cancel() {
    unsavedFeature = null;
    mode.set({ mode: "edit-form", id });
  }
</script>

<!-- TODO move to sidebar -->
<h2>Editing {name}</h2>

{#if controls == "point"}
  <PointControls editingExisting {cancel} />
{:else if controls == "route"}
  <RouteControls
    maptilerApiKey={cfg.maptilerApiKey}
    extendRoute={false}
    {finish}
    {cancel}
  />
{:else if controls == "freehand-polygon"}
  <PolygonControls {finish} {cancel} />
{:else if controls == "snapped-polygon"}
  <SnapPolygonControls {finish} {cancel} />
{/if}
