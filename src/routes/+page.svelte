<script lang="ts">
  import "../style/main.css";
  import { map, type Config } from "$lib/config";
  import {
    BoundaryLayer,
    ImageLayer,
    InterventionLayer,
    NewFeatureForm,
    Toolbox,
  } from "$lib/draw";
  import { emptySchemes, mode } from "$lib/draw/stores";
  import type { SchemeData } from "$lib/draw/types";
  import { EditFeatureForm, ListMode } from "$lib/sidebar";
  // @ts-expect-error no declarations
  import { initAll } from "govuk-frontend";
  import { SecondaryButton } from "govuk-svelte";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import { MapLibre } from "svelte-maplibre";
  import { writable } from "svelte/store";
  import ExampleFeatureForm from "./ExampleFeatureForm.svelte";
  import ExampleSchemeForm from "./ExampleSchemeForm.svelte";
  import type { ExampleFeature, ExampleScheme } from "./types";

  onMount(() => {
    initAll();
  });

  // Use your own key (for MapTiler or another basemap service)
  let apiKey = "MZEJTanw3WpxRvt7qDfo";
  let routeSnapperUrl = "https://atip.uk/route-snappers/v3/LAD_Adur.bin.gz";
  let boundaryGeojson = {
    type: "Feature" as const,
    geometry: {
      type: "Polygon" as const,
      coordinates: [
        [
          [-0.364623, 50.874533],
          [-0.371208, 50.869793],
          [-0.367479, 50.860539],
          [-0.369022, 50.855288],
          [-0.365441, 50.846933],
          [-0.358547, 50.843541],
          [-0.358369, 50.830646],
          [-0.349344, 50.822407],
          [-0.339007, 50.822184],
          [-0.330269, 50.816102],
          [-0.299725, 50.823206],
          [-0.280328, 50.825936],
          [-0.25188, 50.825546],
          [-0.237095, 50.828265],
          [-0.21626, 50.826897],
          [-0.215382, 50.830533],
          [-0.234361, 50.851116],
          [-0.239727, 50.861896],
          [-0.244998, 50.863815],
          [-0.248948, 50.870547],
          [-0.258962, 50.871214],
          [-0.256606, 50.862342],
          [-0.269032, 50.863672],
          [-0.287977, 50.864159],
          [-0.298485, 50.866274],
          [-0.311454, 50.864779],
          [-0.320283, 50.865434],
          [-0.339752, 50.862547],
          [-0.349058, 50.865902],
          [-0.364623, 50.874533],
        ],
      ],
    },
    properties: {},
  };

  let cfg: Config<ExampleFeature, ExampleScheme> = {
    interventionName: (f) => `some ${f.geometry.type} feature`,

    schemeName: (s) => s.scheme_name || "untitled scheme",

    backfill: (json) => json,

    initializeEmptyScheme: (scheme) => {
      let s = scheme as SchemeData & ExampleScheme;
      s.scheme_name = "";
      return s;
    },

    interventionWarning: (props) => null,

    editFeatureForm: ExampleFeatureForm,

    editSchemeForm: ExampleSchemeForm,

    newPointFeature: (f) => {},
    newPolygonFeature: (f) => {},
    newLineStringFeature: (f) => {},

    updateFeature: (destination, source) => {},

    // Just one from the dataviz basemap, as an example
    getStreetViewRoadLayerNames: (map) => ["Road network"],

    layerZorder: [
      // Polygons are bigger than lines, which're bigger than points. When geometry
      // overlaps, put the smaller thing on top
      "interventions-polygons",
      "interventions-polygons-outlines",
      // This is an outline, so draw on top
      "hover-polygons",

      // The hover effect thickens, so draw beneath
      "hover-lines",
      "interventions-lines",
      "interventions-lines-endpoints",

      "hover-points",
      "interventions-points",

      "draw-split-route",

      // From the dataviz basemap
      "road_label",

      // Draw the inverted boundary fade on top of basemap labels
      "boundary",

      // TODO This might look nicer lower
      "georeferenced-image",
    ],
  };

  let gjSchemes = writable(emptySchemes(cfg));

  function exportGj() {
    downloadGeneratedFile(
      "sketch.geojson",
      JSON.stringify($gjSchemes, null, "  "),
    );
  }

  function downloadGeneratedFile(filename: string, textInput: string) {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(textInput),
    );
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<div style="display: flex; height: 100vh">
  <div class="sidebar">
    {#if $mode.mode == "list" || $mode.mode == "split-route" || $mode.mode == "set-image" || $mode.mode == "streetview"}
      <SecondaryButton on:click={exportGj}>Export GeoJSON</SecondaryButton>
      <ListMode {cfg} {gjSchemes} />
    {:else if $mode.mode == "new-point" || $mode.mode == "new-area" || $mode.mode == "new-route"}
      <NewFeatureForm {cfg} {gjSchemes} />
    {:else if $mode.mode == "edit"}
      <EditFeatureForm {cfg} {gjSchemes} id={$mode.id} />
    {/if}
  </div>
  <div class="map">
    <MapLibre
      style="https://api.maptiler.com/maps/dataviz/style.json?key={apiKey}"
      standardControls
      on:error={(e) => {
        // @ts-expect-error Not exported
        console.log(e.detail.error);
      }}
      bind:map={$map}
    >
      <BoundaryLayer {cfg} {boundaryGeojson} fitBoundsAtStart />
      <InterventionLayer {cfg} {gjSchemes} />
      <ImageLayer {cfg} />
      <Toolbox {cfg} {gjSchemes} {routeSnapperUrl} />
    </MapLibre>
  </div>
</div>

<style>
  .sidebar {
    width: 30%;
    overflow-y: scroll;
    padding: 10px;
  }

  .map {
    position: relative;
    width: 70%;
  }
</style>
