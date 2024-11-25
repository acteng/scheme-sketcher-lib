<script lang="ts">
  // A variation of Radio that omits the legend entirely and forces the labels to not wrap.

  import { v4 as uuidv4 } from "uuid";

  // A list of [value, label] representing the choices
  export let choices: [string, string][];
  export let style = "";

  // The current value
  export let value: string;

  let id = uuidv4();
</script>

<div
  class="govuk-radios govuk-radios--inline govuk-radios--small"
  data-module="govuk-radios"
  {style}
>
  {#each choices as [thisValue, thisLabel]}
    <div class="govuk-radios__item">
      <input
        class="govuk-radios__input"
        id={id + thisValue}
        type="radio"
        bind:group={value}
        value={thisValue}
        on:change
      />
      <label
        class="govuk-label govuk-radios__label"
        for={id + thisValue}
        style="max-width: 100%"
      >
        {thisLabel}
      </label>
    </div>
  {/each}
</div>
