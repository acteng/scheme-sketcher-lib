<script lang="ts" generics="F, S">
  import deleteIcon from "$lib/assets/delete.svg?url";
  import { Modal, WarningIcon } from "$lib/common";
  import { map, type Config } from "$lib/config";
  import {
    emptySchemes,
    hideSchemes,
    mode,
    sidebarHover,
  } from "$lib/draw/stores";
  import type { Schemes } from "$lib/draw/types";
  import { bbox } from "$lib/maplibre";
  import {
    ButtonGroup,
    Checkbox,
    CheckboxGroup,
    DefaultButton,
    ErrorMessage,
    SecondaryButton,
    Select,
    WarningButton,
  } from "govuk-svelte";
  import { onDestroy } from "svelte";
  import type { Writable } from "svelte/store";

  export let cfg: Config<F, S>;
  export let gjSchemes: Writable<Schemes<F, S>>;
  export let scheme_reference: string;

  let showEditModal = false;
  let showDeleteModal = false;

  $: numErrors = $gjSchemes.features.filter(
    (f) =>
      f.properties.scheme_reference == scheme_reference &&
      cfg.interventionWarning(f.properties) != null,
  ).length;
  $: numFeatures = $gjSchemes.features.filter(
    (f) => f.properties.scheme_reference == scheme_reference,
  ).length;

  onDestroy(() => {
    sidebarHover.set(null);
  });

  function edit(e: MouseEvent, id: number) {
    // Use <a> for buttons. Disable the href behavior.
    e.preventDefault();

    // When the user starts editing something from the sidebar, warp to what's
    // being edited. (Don't do this when clicking the object on the map.)
    let feature = $gjSchemes.features.find((f) => f.id == id)!;

    // Padding around a point looks odd; special case it by keeping the current zoom
    if (feature.geometry.type == "Point") {
      $map?.flyTo({
        center: feature.geometry.coordinates as [number, number],
        duration: 500,
      });
    } else {
      $map?.fitBounds(bbox(feature), {
        padding: 200,
        duration: 500,
      });
    }

    mode.set({ mode: "edit", id });
  }

  function unhover(id: number) {
    sidebarHover.update((current) => {
      if (current == id) {
        return null;
      }
      return current;
    });
  }

  function deleteScheme() {
    gjSchemes.update((gj) => {
      gj.features = gj.features.filter(
        (f) => f.properties.scheme_reference != scheme_reference,
      );
      delete gj.schemes[scheme_reference];
      if (Object.keys(gj.schemes).length == 0) {
        gj = emptySchemes(cfg);
      }
      return gj;
    });
    hideSchemes.update((set) => {
      set.delete(scheme_reference);
      return set;
    });
    showDeleteModal = false;
  }

  let moveToScheme = "";
  function moveFeatures() {
    if (moveToScheme) {
      gjSchemes.update((gj) => {
        for (let f of gj.features) {
          if (f.properties.scheme_reference == scheme_reference) {
            f.properties.scheme_reference = moveToScheme;
          }
        }
        return gj;
      });
    }
  }

  function moveSchemeChoices(): [string, string][] {
    return Object.values($gjSchemes.schemes)
      .filter((scheme) => scheme.scheme_reference != scheme_reference)
      .map((scheme) => [scheme.scheme_reference, cfg.schemeName(scheme)]);
  }

  // TODO Svelte can't bind to set membership?
  let showScheme = !$hideSchemes.has(scheme_reference);
  function showOrHide() {
    hideSchemes.update((set) => {
      if (showScheme) {
        set.delete(scheme_reference);
      } else {
        set.add(scheme_reference);
      }
      return set;
    });
  }

  function onKeyDown(e: KeyboardEvent) {
    if (showEditModal && e.key == "Escape") {
      e.stopPropagation();
      showEditModal = false;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<CheckboxGroup small>
  <Checkbox bind:checked={showScheme} on:change={showOrHide}>
    <b>{cfg.schemeName($gjSchemes.schemes[scheme_reference])}</b>
  </Checkbox>
</CheckboxGroup>

<div style="display: flex; justify-content: space-between;">
  <input type="color" bind:value={$gjSchemes.schemes[scheme_reference].color} />
  <div>
    <slot />
    <SecondaryButton on:click={() => (showEditModal = true)} noBottomMargin>
      Edit
    </SecondaryButton>
  </div>
</div>

{#if showScheme}
  {#if numErrors == 1}
    <ErrorMessage
      errorMessage="There's a problem with one intervention below"
    />
  {:else if numErrors > 0}
    <ErrorMessage
      errorMessage="There's a problem with {numErrors} interventions below"
    />
  {/if}

  {#if numFeatures == 0}
    <p>There are no interventions in this scheme</p>
  {/if}

  <ol class="govuk-list govuk-list--number">
    {#each $gjSchemes.features.filter((f) => f.properties.scheme_reference == scheme_reference) as feature (feature.id)}
      {@const warning = cfg.interventionWarning(feature.properties)}
      <li>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
          href="#"
          on:click={(e) => edit(e, feature.id)}
          on:mouseenter={() => sidebarHover.set(feature.id)}
          on:mouseleave={() => unhover(feature.id)}
        >
          {#if warning}
            <WarningIcon text={warning} />
          {/if}
          {cfg.interventionName(feature)}
        </a>
      </li>
    {/each}
  </ol>
{/if}

<Modal title="Edit scheme" bind:open={showEditModal}>
  {#if showEditModal}
    <svelte:component
      this={cfg.editSchemeForm}
      {gjSchemes}
      {scheme_reference}
    />
  {/if}

  <ButtonGroup>
    <DefaultButton on:click={() => (showEditModal = false)}>
      Save changes
    </DefaultButton>
    <WarningButton
      on:click={() => {
        showEditModal = false;
        showDeleteModal = true;
      }}
    >
      <img src={deleteIcon} alt="Delete scheme" />
      Delete
    </WarningButton>
  </ButtonGroup>
</Modal>

<Modal
  title="Delete this scheme?"
  bind:open={showDeleteModal}
  displayEscapeButton={false}
>
  {#if numFeatures > 0 && moveSchemeChoices().length > 0}
    <p>
      Do you want to first move {numFeatures}
      {numFeatures == 1 ? "intervention" : "interventions"} to another scheme?
    </p>
    <Select
      label="Move interventions to another scheme"
      choices={moveSchemeChoices()}
      bind:value={moveToScheme}
      on:change={moveFeatures}
    />
  {/if}

  <ButtonGroup>
    <WarningButton on:click={deleteScheme}>Delete scheme</WarningButton>
    <SecondaryButton on:click={() => (showDeleteModal = false)}>
      Cancel
    </SecondaryButton>
  </ButtonGroup>
</Modal>
