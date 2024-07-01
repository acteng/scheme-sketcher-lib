<script>import { routeTool } from "../stores";
import { TextInput } from "govuk-svelte";
import { emptyGeojson } from "../../maplibre";
import { map } from "../../config";
import { geocoderGj } from "./stores";
let query = "";
async function runQuery(query2) {
  if (!query2) {
    $geocoderGj = emptyGeojson();
    return;
  }
  let params = new URLSearchParams({
    country: "gb",
    proximity: $map.getCenter().toArray().join(","),
    fuzzyMatch: "true",
    key: import.meta.env.VITE_MAPTILER_API_KEY
  }).toString();
  let url = `https://api.maptiler.com/geocoding/${query2}.json?${params}`;
  let resp = await fetch(url);
  let gj = await resp.json();
  let i = 1;
  for (let f of gj.features) {
    f.properties.number = i++;
  }
  $geocoderGj = gj;
}
$:
  runQuery(query);
function add(e, pt) {
  e.preventDefault();
  $routeTool.addSnappedWaypoint(pt);
  query = "";
}
</script>

<TextInput label="Add waypoint by search" bind:value={query} />

<ol class="govuk-list govuk-list--number">
  {#each $geocoderGj.features as f}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li><a href="#" on:click={(e) => add(e, f.center)}>{f.place_name}</a></li>
  {/each}
</ol>
