<script lang="ts">
  import { fetchWithProgress } from "$lib/common";
  import { routeTool } from "$lib/draw/stores";
  import { emptyGeojson } from "$lib/maplibre";
  import { ErrorMessage } from "govuk-svelte";
  import type { Map } from "maplibre-gl";
  import { inflate } from "pako";
  import { init, RouteTool } from "route-snapper-ts";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let map: Map;
  export let url: string;

  let progress: number = 0;
  let routeToolReady = false;
  $: downloadComplete = progress >= 100;
  let failedToLoadRouteTool = false;

  onMount(async () => {
    await init();

    console.log(`Grabbing ${url}`);
    try {
      const graphBytes = await fetchWithProgress(url, (p) => {
        progress = p;
      });

      routeTool.set(setupRouteTool(graphBytes));
      progress = 100;
      routeToolReady = true;
    } catch (err) {
      console.log(`Route tool broke: ${err}`);
      failedToLoadRouteTool = true;
    }
  });

  function setupRouteTool(graphBytes: Uint8Array): RouteTool {
    // First trust that the browser received the "Content-Encoding: gzip" header and try to deserialize that.
    try {
      // The stores are unused; the WASM API is used directly. This TS wrapper is unused.
      return new RouteTool(
        map,
        graphBytes,
        writable(emptyGeojson()),
        writable(true),
        writable(0),
      );
    } catch (err) {
      console.log(
        `Failed to set the route snapper up (${err}). Trying to decompress first.`,
      );
      let inflatedBytes = inflate(graphBytes);
      console.log(
        `Decompression worked, trying to set up the route snapper again`,
      );
      return new RouteTool(
        map,
        inflatedBytes,
        writable(emptyGeojson()),
        writable(true),
        writable(0),
      );
    }
  }
</script>

{#if !routeToolReady && !failedToLoadRouteTool && !downloadComplete}
  <label for="route-loading">Route tool loading</label>
  <progress id="route-loading" value={progress} />
{:else if downloadComplete && !routeToolReady && !failedToLoadRouteTool}
  <label for="route-unpacking">Route data unpacking</label>
  <progress id="route-unpacking" />
{:else if failedToLoadRouteTool}
  <ErrorMessage errorMessage="Failed to load route snapper" />
{/if}

<style>
  progress {
    width: 100%;
  }
</style>
