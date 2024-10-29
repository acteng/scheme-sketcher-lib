<script lang="ts">
  import { TextInput } from "govuk-svelte";
  import type { Schemes } from "$lib/draw/types";
  import type { Writable } from "svelte/store";
  import type { ExampleFeature, ExampleScheme } from "./types";

  export let gjSchemes: Writable<Schemes<ExampleFeature, ExampleScheme>>;
  export let scheme_reference: string;
</script>

<TextInput
  label="Scheme name"
  required
  bind:value={$gjSchemes.schemes[scheme_reference].scheme_name}
/>
