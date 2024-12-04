<script lang="ts" generics="F, S">
  import type { Feature, LineString, Point, Polygon } from "geojson";
  import {
    mode,
    routeTool,
    featureProps,
    pointPosition,
    setPrecision,
  } from "$lib/draw/stores";
  import { waypoints as routeWaypoints } from "./route/stores";
  import { waypoints as areaWaypoints, calculateArea } from "./area/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import { type Config } from "$lib/config";
  import { onDestroy, onMount } from "svelte";
  import PointControls from "./point/PointControls.svelte";
  import RouteControls from "./route/RouteControls.svelte";
  import AreaControls from "./area/AreaControls.svelte";
  import type { AreaProps, RouteProps } from "route-snapper-ts";
  import type { Writable } from "svelte/store";
  import { finishCurrentFeature } from "./stores";

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
      if (feature.properties.waypoints) {
        // Transform into the correct format
        $routeWaypoints = feature.properties.waypoints.map((waypt) => {
          return {
            point: [waypt.lon, waypt.lat],
            snapped: waypt.snapped,
          };
        });
      } else {
        // Imported from another file. Assume every point is freehand; the user
        // can manually turn into snapped if needed.
        $routeWaypoints = feature.geometry.coordinates.map((pt) => {
          return {
            point: JSON.parse(JSON.stringify(pt)),
            snapped: false,
          };
        });
      }
      controls = "route";
      finishCurrentFeature.set(finishRoute);
    } else if (feature.geometry.type == "Polygon") {
      if (feature.properties.waypoints) {
        // Transform into the correct format
        $areaWaypoints = feature.properties.waypoints.map((waypt) => {
          return {
            point: [waypt.lon, waypt.lat],
            snapped: waypt.snapped,
          };
        });
      } else {
        // Imported from another file. Assume every point is freehand; the user
        // can manually turn into snapped if needed. Ignore any holes.
        $areaWaypoints = feature.geometry.coordinates[0].map((pt) => {
          return {
            point: JSON.parse(JSON.stringify(pt)),
            snapped: false,
          };
        });
        $areaWaypoints.pop();
        $areaWaypoints = $areaWaypoints;
      }
      controls = "area";
      finishCurrentFeature.set(finishArea);
    } else if (feature.geometry.type == "Point") {
      $pointPosition = JSON.parse(JSON.stringify(feature.geometry.coordinates));
      controls = "point";
      finishCurrentFeature.set(finish);
    }
  });
  onDestroy(() => {
    $pointPosition = null;
    finishCurrentFeature.set(() => {});
    
    $routeTool?.stop();
    $routeTool?.clearEventListeners();

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
  $: updatePoint($pointPosition);
  function updatePoint(pt: [number, number] | null) {
    if (unsavedFeature?.geometry.type == "Point" && pt) {
      unsavedFeature.geometry.coordinates = setPrecision(pt);
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

  function finishRoute() {
    // Don't constantly update unsavedFeature for routes; it'll do unnecessary extra work.
    if ($routeTool) {
      try {
        let out = $routeTool.inner.calculateRoute($routeWaypoints);
        unsavedFeature = JSON.parse(out);
      } catch (err) {
        console.warn(`Finishing route failed: ${err}`);
      }
    }
    finish();
  }

  function finishArea() {
    // Don't constantly update unsavedFeature for areas; it'll do unnecessary extra work.
    if ($routeTool && $areaWaypoints.length >= 3) {
      try {
        unsavedFeature = calculateArea(
          $routeTool,
          $areaWaypoints,
        ) as FeatureWithID<F>;
      } catch (err) {
        console.warn(`Finishing area failed: ${err}`);
      }
    }
    finish();
  }

  function cancel() {
    unsavedFeature = null;
    mode.set({ mode: "list" });
  }
</script>

{#if controls == "point"}
  <PointControls {finish} {cancel} />
{:else if controls == "route"}
  <RouteControls finish={finishRoute} {cancel} />
{:else if controls == "area"}
  <AreaControls finish={finishArea} {cancel} />
{/if}
