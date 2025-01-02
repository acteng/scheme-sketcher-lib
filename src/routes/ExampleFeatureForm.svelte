<script lang="ts">
  import { type Config } from "$lib/config";
  import type { FeatureProps, Schemes } from "$lib/draw/types";
  import { Radio, Select, TextArea, TextInput } from "govuk-svelte";
  import type { Writable } from "svelte/store";
  import type { ExampleFeature, ExampleScheme } from "./types";

  export let cfg: Config<ExampleFeature, ExampleScheme>;
  export let gjSchemes: Writable<Schemes<ExampleFeature, ExampleScheme>>;
  export let id: number | null;
  export let props: FeatureProps<ExampleFeature>;

  // Hide svelte-check warning
  let _ = id;
</script>

<TextInput label="Name" bind:value={props.name} />

<Select
  label="Scheme"
  choices={Object.values($gjSchemes.schemes).map((scheme) => [
    scheme.scheme_reference,
    cfg.schemeName(scheme),
  ])}
  bind:value={props.scheme_reference}
/>

<Radio
  label="Likelihood of construction"
  choices={[
    ["moonshot", "Moonshot"],
    ["maybe", "Maybe?"],
    ["definitely", "Definitely!"],
  ]}
  inlineSmall
  required
  bind:value={props.likelihood}
/>

<TextArea label="Description" bind:value={props.description} />
