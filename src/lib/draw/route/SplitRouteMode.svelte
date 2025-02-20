<script lang="ts" generics="F, S">
  // Note this component has to embedded underneath <Map> for the <GeoJSON>
  // component to work. This is an exception to how LeftSidebar manages most
  // modes.

  import nearestPointOnLine from "@turf/nearest-point-on-line";
  import splitIcon from "$lib/assets/split_route.svg";
  import { HelpButton } from "$lib/common";
  import { map, type Config } from "$lib/config";
  import { mode, newFeatureId, setPrecision } from "$lib/draw/stores";
  import type { FeatureWithID, Schemes } from "$lib/draw/types";
  import { emptyGeojson, layerId } from "$lib/maplibre";
  import type { Feature, LineString, Point, Position } from "geojson";
  import { DefaultButton } from "govuk-svelte";
  import type { MapMouseEvent } from "maplibre-gl";
  import { splitRoute, type RouteProps } from "route-snapper-ts";
  import { onDestroy, onMount } from "svelte";
  import { CircleLayer, GeoJSON, MapEvents } from "svelte-maplibre";
  import type { Writable } from "svelte/store";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  const circleRadiusPixels = 10;
  const snapDistancePixels = 30;

  onMount(() => {
    // Use a fallback icon in case the image fails
    if ($map) {
      $map.getCanvas().style.cursor = `url(${splitIcon}), crosshair`;
    }
  });
  onDestroy(() => {
    if ($map) {
      $map.getCanvas().style.cursor = "inherit";
    }
  });

  let snappedCursor: Feature<Point> | null = null;
  // Index into gjScheme of what we're snapped to
  let snappedIndex: number | null = null;

  let snappedCursorGj = emptyGeojson();
  $: {
    let gj = emptyGeojson();
    if (snappedCursor) {
      gj.features.push(snappedCursor);
    }
    snappedCursorGj = gj;
  }

  function onMouseMove(e: CustomEvent<MapMouseEvent>) {
    if (!$map) {
      return;
    }
    snappedCursor = null;
    snappedIndex = null;

    let cursor = cursorFeature(e.detail.lngLat.toArray());
    const nearbyPoint: [number, number] = [
      e.detail.point.x - snapDistancePixels,
      e.detail.point.y,
    ];
    const thresholdKm =
      $map.unproject(e.detail.point).distanceTo($map.unproject(nearbyPoint)) /
      1000.0;

    // Are we snapped to anything?
    let candidates: [number, Position, number][] = [];
    for (let [index, f] of $gjSchemes.features.entries()) {
      if (f.geometry.type == "LineString") {
        let snapped = nearestPointOnLine(f.geometry, cursor, {
          units: "kilometers",
        });
        if (
          snapped.properties.dist != undefined &&
          snapped.properties.dist <= thresholdKm
        ) {
          candidates.push([
            index,
            snapped.geometry.coordinates,
            snapped.properties.dist,
          ]);
        }
      }
    }
    candidates.sort((a, b) => a[2] - b[2]);

    if (candidates.length > 0) {
      snappedCursor = cursorFeature(candidates[0][1]);
      snappedIndex = candidates[0][0];
    }
  }

  function onClick() {
    if (snappedIndex == null) {
      // We clicked the map, stop the tool
      mode.set({ mode: "list" });
      return;
    }

    let result = splitRoute(
      $gjSchemes.features[snappedIndex] as unknown as Feature<
        LineString,
        RouteProps
      >,
      snappedCursor!,
    );

    if (result != null) {
      let [piece1, piece2] = result;
      gjSchemes.update((gj) => {
        // Keep the old ID for one, assign a new ID to the other
        piece1.id = gj.features[snappedIndex!].id;
        piece2.id = newFeatureId(gj);

        // Replace the one LineString we snapped to with the two new pieces
        gj.features.splice(
          snappedIndex!,
          1,
          // Casts safe because the input has these invariants
          piece1 as unknown as FeatureWithID<F>,
          piece2 as unknown as FeatureWithID<F>,
        );

        return gj;
      });
    }

    // Stay in this mode, but reset state
    snappedCursor = null;
    snappedIndex = null;
  }

  // The escape key isn't registered at all for keypress, so use keydown
  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      e.stopPropagation();
      mode.set({ mode: "list" });
    }
  }

  function cursorFeature(pt: number[]): Feature<Point> {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: setPrecision(pt),
      },
    };
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<MapEvents on:mousemove={onMouseMove} on:click={onClick} />

<GeoJSON data={snappedCursorGj}>
  <CircleLayer
    {...layerId(cfg, "draw-split-route")}
    paint={{ "circle-color": "black", "circle-radius": circleRadiusPixels }}
  />
</GeoJSON>

<div style="float: right">
  <FixedButtonGroup>
    <DefaultButton
      on:click={() => mode.set({ mode: "list" })}
      style="margin-bottom: 0px"
    >
      Finish
    </DefaultButton>

    <HelpButton>
      <ul>
        <li>
          <b>Click</b>
          on a route to split it
        </li>
        <li>
          <b>Click</b>
          on the map or press
          <b>Escape</b>
          to cancel
        </li>
      </ul>
    </HelpButton>
  </FixedButtonGroup>
</div>
