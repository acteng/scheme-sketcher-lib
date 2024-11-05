<script lang="ts" generics="F, S">
  import { position, isActive } from "./stores";
  import { MapEvents, Marker } from "svelte-maplibre";
  import type { MapMouseEvent } from "maplibre-gl";

  function onClick(e: CustomEvent<MapMouseEvent>) {
    if ($isActive && !$position) {
      $position = e.detail.lngLat.toArray();
    }
  }

  function onDoubleClick() {
    if ($isActive) {
      window.alert("TODO: exit mode");
    }
  }
</script>

<MapEvents on:click={onClick} on:dblclick={onDoubleClick} />

{#if $position}
  <Marker draggable bind:lngLat={$position}>
    <span class="dot" />
  </Marker>
{/if}

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
