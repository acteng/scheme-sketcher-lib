<script lang="ts">
  import { gjSchemeCollection } from "$lib/draw/stores";
  import { TextInput, Radio, Select, TextArea } from "govuk-svelte";
  import { cfg } from "$lib/config";

  export let id: number;
  // TODO Can we make this generic?
  export let props: { [name: string]: any };

  // Hide svelte-check warning
  let _ = id;
</script>

<TextInput label="Name" bind:value={props.name} />

<Select
  label="Scheme"
  choices={Object.values($gjSchemeCollection.schemes).map((scheme) => [
    scheme.scheme_reference,
    cfg.schemeName(scheme),
  ])}
  bind:value={props.scheme_reference}
/>

<Radio
  legend="Likelihood of construction"
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
