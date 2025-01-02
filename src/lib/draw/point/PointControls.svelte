<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { map } from "$lib/config";
  import { pointPosition } from "$lib/draw/stores";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import type { MapMouseEvent } from "maplibre-gl";
  import { onDestroy, onMount } from "svelte";
  import { MapEvents, Marker } from "svelte-maplibre";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";

  export let finish: () => void;
  export let cancel: () => void;

  onMount(() => {
    if ($map) {
      $map.doubleClickZoom.disable();
    }
  });
  onDestroy(() => {
    if ($map) {
      $map.doubleClickZoom.enable();
    }
  });

  function onClick(e: CustomEvent<MapMouseEvent>) {
    if (!$pointPosition) {
      $pointPosition = e.detail.lngLat.toArray();
    }
  }

  function onDoubleClick() {
    finish();
  }

  function keyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      e.stopPropagation();
      if ($pointPosition) {
        finish();
      } else {
        window.alert(
          "You can't save this point until you place it on the map. Press 'Cancel' to discard these changes.",
        );
      }
    }
  }
</script>

<svelte:window on:keydown={keyDown} />

<MapEvents on:click={onClick} on:dblclick={onDoubleClick} />

{#if $pointPosition}
  <Marker draggable bind:lngLat={$pointPosition}>
    <span class="dot" />
  </Marker>
{/if}

<div style="float: right">
  <FixedButtonGroup>
    <DefaultButton on:click={finish} style="margin-bottom: 0px">
      Finish
    </DefaultButton>
    <SecondaryButton on:click={cancel} noBottomMargin>Cancel</SecondaryButton>

    <HelpButton>
      <ul>
        {#if $pointPosition}
          <li>Click and drag the point to move it</li>
        {:else}
          <li>Click the map to add a point</li>
        {/if}
        <li>
          <b>Double click</b>
          the map to finish or press
          <b>Escape</b>
          to cancel
        </li>
      </ul>

      <p>Keyboard shortcuts:</p>
      <ul>
        <li>
          From the main mode, <b>1</b>
          to draw a new point
        </li>
      </ul>
    </HelpButton>
  </FixedButtonGroup>
</div>

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
    background: red;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }
</style>
