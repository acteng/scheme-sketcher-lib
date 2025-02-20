<script lang="ts" generics="F, S">
  import { type Config } from "$lib/config";
  import { addEmptyScheme } from "$lib/draw/stores";
  import type { Schemes } from "$lib/draw/types";
  import { ErrorMessage, FileInput, SecondaryButton } from "govuk-svelte";
  import type { Writable } from "svelte/store";
  import PerSchemeControls from "./PerSchemeControls.svelte";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;

  function newBlankScheme() {
    addEmptyScheme(cfg, $gjSchemes);
    $gjSchemes = $gjSchemes;
  }

  let errorFromFile = "";
  function mergeSchemesFromFile(filename: string, text: string) {
    try {
      let gj: Schemes<F, S> = cfg.backfill(JSON.parse(text));

      for (let scheme of Object.values(gj.schemes)) {
        if (scheme.scheme_reference in $gjSchemes.schemes) {
          throw new Error(
            "The file you're loading seems to contain duplicate data. Are you merging in the same file accidentally?",
          );
        }
        $gjSchemes.schemes[scheme.scheme_reference] = scheme;
      }
      $gjSchemes.features = $gjSchemes.features.concat(gj.features);

      // Make sure every feature ID is unique. It's fine to change existing
      // features, since no tool can be open and holding an ID.
      let i = 1;
      $gjSchemes.features.forEach((feature) => {
        feature.id = i++;
      });

      $gjSchemes = $gjSchemes;
      errorFromFile = "";
    } catch (err) {
      errorFromFile = `Couldn't load scheme from a file: ${err}`;
    }
  }

  function moveSchemeInList(scheme_reference: string, direction: number) {
    const currentSchemeOrder = JSON.parse(
      JSON.stringify(Object.keys($gjSchemes.schemes)),
    );
    const currentIndex = currentSchemeOrder.indexOf(scheme_reference);
    if (
      currentIndex + direction >= 0 &&
      currentIndex + direction < currentSchemeOrder.length
    ) {
      swapArrayValuesInPlace(
        currentSchemeOrder,
        currentIndex,
        currentIndex + direction,
      );
      const newSchemesObject = getReorderedSchemesObject(
        currentSchemeOrder,
        $gjSchemes.schemes,
      );
      $gjSchemes.schemes = newSchemesObject;
      $gjSchemes = $gjSchemes;
    }
  }

  function swapArrayValuesInPlace(
    array: any[],
    firstIndex: number,
    secondIndex: number,
  ) {
    [array[firstIndex], array[secondIndex]] = [
      array[secondIndex],
      array[firstIndex],
    ];
  }

  function getReorderedSchemesObject(
    newSchemeOrder: string[],
    currentSchemesObject: { [reference: string]: any },
  ) {
    const result: { [reference: string]: any } = {};
    newSchemeOrder.forEach((scheme_reference) => {
      result[scheme_reference] = currentSchemesObject[scheme_reference];
    });

    return result;
  }
</script>

<div style="border: 1px solid black; padding: 8px">
  <div style="display: flex; justify-content: space-between;">
    <SecondaryButton on:click={newBlankScheme}>
      Add blank scheme
    </SecondaryButton>
    <FileInput label="Add scheme from file" onLoad={mergeSchemesFromFile} />
  </div>
  <ErrorMessage errorMessage={errorFromFile} />

  <hr />

  {#each Object.keys($gjSchemes.schemes) as scheme_reference, i (scheme_reference)}
    <PerSchemeControls {cfg} {gjSchemes} {scheme_reference}>
      <SecondaryButton
        on:click={() => moveSchemeInList(scheme_reference, -1)}
        disabled={i == 0}
        noBottomMargin
      >
        &uarr;
      </SecondaryButton>
      <SecondaryButton
        on:click={() => moveSchemeInList(scheme_reference, 1)}
        disabled={i == Object.keys($gjSchemes.schemes).length - 1}
        noBottomMargin
      >
        &darr;
      </SecondaryButton>
    </PerSchemeControls>
    <hr />
  {/each}
</div>
