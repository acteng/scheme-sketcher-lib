<script lang="ts" generics="F, S">
  import { type Config } from "$lib/config";
  import { onDestroy, onMount } from "svelte";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import { featureProps } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  // Always start with blank properties
  onMount(() => {
    $featureProps = {};
  });
  onDestroy(() => {
    $featureProps = {};
  });
</script>

<h2>New intervention</h2>

<svelte:component
  this={cfg.editFeatureForm}
  {cfg}
  {gjSchemes}
  id={null}
  bind:props={$featureProps}
/>
