<script lang="ts" generics="F, S">
  import { CollapsibleCard, Radio, SecondaryButton } from "govuk-svelte";
  import type { MapMouseEvent } from "maplibre-gl";
  import { userSettings } from "$lib/draw/stores";
  import { onDestroy } from "svelte";
  import cameraCursorUrl from "$lib/assets/camera_cursor.svg?url";
  import StreetViewHelp from "./StreetViewHelp.svelte";
  import type { Map } from "maplibre-gl";

  export let cfg: { getStreetViewRoadLayerNames: (map: Map) => string[] };
  export let map: Map | null;
  export let enabled: boolean;
  export let showControls = true;

  let defaultLineColorPerLayer: [string, any][] = [];

  function on() {
    if (!map) {
      return;
    }
    map.on("click", onClick);
    map.getCanvas().style.cursor = `url(${cameraCursorUrl}), auto`;

    for (let layer of cfg.getStreetViewRoadLayerNames(map)) {
      defaultLineColorPerLayer.push([
        layer,
        map.getPaintProperty(layer, "line-color"),
      ]);
      map.setPaintProperty(layer, "line-color", "cyan");
    }
  }

  function off() {
    if (map) {
      map.off("click", onClick);
      map.getCanvas().style.cursor = "inherit";

      for (let [layer, value] of defaultLineColorPerLayer) {
        map.setPaintProperty(layer, "line-color", value);
      }
      defaultLineColorPerLayer = [];
    }
  }
  onDestroy(off);

  $: if (enabled) {
    on();
  } else {
    off();
  }

  function onClick(e: MapMouseEvent) {
    if (!enabled) {
      return;
    }
    let lon = e.lngLat.lng;
    let lat = e.lngLat.lat;
    if ($userSettings.streetViewImagery == "google") {
      window.open(
        `http://maps.google.com/maps?q=&layer=c&cbll=${lat},${lon}&cbp=11,0,0,0,0`,
        "_blank",
      );
    } else if ($userSettings.streetViewImagery == "bing") {
      window.open(
        `https://www.bing.com/maps?cp=${lat}~${lon}&style=x`,
        "_blank",
      );
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (enabled && e.key == "Escape") {
      e.stopPropagation();
      enabled = false;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

{#if showControls}
  {#if enabled}
    <SecondaryButton on:click={() => (enabled = false)}>
      Disable Street View
    </SecondaryButton>

    <Radio
      legend="Source"
      choices={[
        ["google", "Google Street View"],
        ["bing", "Bing Streetside"],
      ]}
      bind:value={$userSettings.streetViewImagery}
    />

    <CollapsibleCard label="Help">
      <StreetViewHelp />
    </CollapsibleCard>
  {:else}
    <SecondaryButton on:click={() => (enabled = true)}>
      Enable Street View
    </SecondaryButton>
  {/if}
{/if}
