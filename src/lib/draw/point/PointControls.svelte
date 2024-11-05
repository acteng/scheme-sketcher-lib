<script lang="ts">
  import { HelpButton } from "$lib/common";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import FixedButtonGroup from "../FixedButtonGroup.svelte";
  import { position } from "./stores";
  import { MapEvents, Marker } from "svelte-maplibre";
  import type { MapMouseEvent } from "maplibre-gl";
  import { map } from "$lib/config";
  import { onMount, onDestroy } from "svelte";

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
    if (!$position) {
      $position = e.detail.lngLat.toArray();
    }
  }

  function onDoubleClick() {
    finish();
  }

  function keyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      cancel();
    }
  }
</script>

<svelte:window on:keydown={keyDown} />

<MapEvents on:click={onClick} on:dblclick={onDoubleClick} />

{#if $position}
  <Marker draggable bind:lngLat={$position}>
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
        {#if $position}
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
