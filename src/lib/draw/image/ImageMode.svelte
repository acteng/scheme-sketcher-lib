<script lang="ts">
  import { mode } from "$lib/draw/stores";
  import {
    ButtonGroup,
    DefaultButton,
    FormElement,
    WarningButton,
  } from "govuk-svelte";
  import { imgSrc, opacity } from "./stores";
  import { HelpButton } from "$lib/common";
  import ToolControls from "../ToolControls.svelte";

  let fileInput: HTMLInputElement;

  async function fileLoaded(e: Event) {
    let buffer = await fileInput.files![0].arrayBuffer();
    let blob = new Blob([new Uint8Array(buffer)]);
    $imgSrc = URL.createObjectURL(blob);
  }

  function deleteImage() {
    $imgSrc = null;
    $opacity = 100;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      e.stopPropagation();
      mode.set({ mode: "list" });
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<ToolControls>
  <FormElement label="Load an image" id="load-image">
    <input
      bind:this={fileInput}
      on:change={fileLoaded}
      class="govuk-file-upload"
      id="load-image"
      type="file"
    />
  </FormElement>

  {#if $imgSrc}
    <div>
      <label>
        <input type="range" min="0" max="100" bind:value={$opacity} />
        <br />
        Opacity: {$opacity}%
      </label>
    </div>
  {/if}

  <div style="margin-left: auto">
    <div class="govuk-button-group">
      <DefaultButton on:click={() => mode.set({ mode: "list" })}>
        Save
      </DefaultButton>
      <WarningButton on:click={deleteImage} disabled={!$imgSrc}>
        Delete
      </WarningButton>
      <HelpButton>
        <p>
          Note this image isn't saved as part of this scheme. When you close
          this page, it'll be lost.
        </p>
      </HelpButton>
    </div>
  </div>
</ToolControls>

<style>
  .govuk-button-group {
    margin-right: 0;
    flex-wrap: nowrap;
  }
</style>
