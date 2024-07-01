<script>import {
  gjSchemeCollection,
  mode,
  pointTool,
  polygonTool,
  routeTool
} from "./stores";
import { ButtonGroup, DefaultButton, SecondaryButton } from "govuk-svelte";
import { cfg } from "../config";
import { onDestroy, onMount } from "svelte";
import PointControls from "./point/PointControls.svelte";
import PolygonControls from "./polygon/PolygonControls.svelte";
import RouteControls from "./route/RouteControls.svelte";
import SnapPolygonControls from "./snap_polygon/SnapPolygonControls.svelte";
export let id;
let name = "";
let controls = "";
let unsavedFeature = null;
onMount(() => {
  let maybeFeature = null;
  gjSchemeCollection.update((gj) => {
    maybeFeature = gj.features.find((f) => f.id == id);
    maybeFeature.properties.hide_while_editing = true;
    return gj;
  });
  let feature = maybeFeature;
  name = cfg.interventionName(feature);
  if (feature.geometry.type == "LineString") {
    $routeTool?.editExistingRoute(feature);
    $routeTool?.addEventListenerSuccess(onSuccess);
    $routeTool?.addEventListenerUpdated(onUpdate);
    $routeTool?.addEventListenerFailure(onFailure);
    controls = "route";
  } else if (feature.geometry.type == "Polygon") {
    if (feature.properties.waypoints) {
      $routeTool?.editExistingArea(feature);
      $routeTool?.addEventListenerSuccess(onSuccess);
      $routeTool?.addEventListenerUpdated(onUpdate);
      $routeTool?.addEventListenerFailure(onFailure);
      controls = "snapped-polygon";
    } else {
      $polygonTool?.editExisting(feature);
      $polygonTool?.addEventListenerSuccess(onSuccess);
      $polygonTool?.addEventListenerUpdated(onUpdate);
      $polygonTool?.addEventListenerFailure(onFailure);
      controls = "freehand-polygon";
    }
  } else if (feature.geometry.type == "Point") {
    $pointTool?.start();
    $pointTool?.addEventListenerSuccess(onSuccess);
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
  gjSchemeCollection.update((gj) => {
    let featureToBeUpdated = gj.features.find((f) => f.id == id);
    delete featureToBeUpdated.properties.hide_while_editing;
    if (unsavedFeature) {
      updateFeature(featureToBeUpdated, unsavedFeature);
    }
    return gj;
  });
});
function onSuccess(feature) {
  feature.properties ??= {};
  unsavedFeature = feature;
  mode.set({ mode: "edit-form", id });
}
function onUpdate(feature) {
  unsavedFeature = feature;
}
function onFailure() {
  unsavedFeature = null;
  mode.set({ mode: "edit-form", id });
}
function updateFeature(destination, source) {
  destination.geometry = source.geometry;
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

<h2>Editing {name}</h2>

<ButtonGroup>
  <DefaultButton on:click={finish}>Finish</DefaultButton>
  <SecondaryButton on:click={cancel}>Cancel</SecondaryButton>
</ButtonGroup>

{#if controls == "point"}
  <PointControls editingExisting />
{:else if controls == "route"}
  <RouteControls extendRoute={false} />
{:else if controls == "freehand-polygon"}
  <PolygonControls />
{:else if controls == "snapped-polygon"}
  <SnapPolygonControls />
{/if}
