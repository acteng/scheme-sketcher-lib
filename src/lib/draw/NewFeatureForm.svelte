<script lang="ts" generics="F, S">
  import { type Config } from "$lib/config";
  import type { Schemes } from "$lib/draw/types";
  import { DefaultButton, SecondaryButton } from "govuk-svelte";
  import { onDestroy } from "svelte";
  import { get, type Writable } from "svelte/store";
  import {
    cancelCurrentFeature,
    featureProps,
    finishCurrentFeature,
    mode,
  } from "./stores";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  // Always start with blank properties. Run this immediately, NOT in onMount,
  // to avoid racing with anything done in the editFeatureForm component.
  $featureProps = {};

  onDestroy(() => {
    $featureProps = {};
  });
</script>

<h2>New intervention</h2>

<DefaultButton
  on:click={() => {
    $finishCurrentFeature();
  }}
>
  Finish
</DefaultButton>

<SecondaryButton
  on:click={() => {
    $cancelCurrentFeature();
  }}
>
  Cancel
</SecondaryButton>

<svelte:component
  this={cfg.editFeatureForm}
  {cfg}
  {gjSchemes}
  id={null}
  bind:props={$featureProps}
/>
