<script>import { circleRadius, colors, lineWidth } from "./colors";
import { gjSchemeCollection, hideSchemes, mode } from "./stores";
import {
  addLineStringEndpoints,
  constructMatchExpression,
  isLine,
  isPoint,
  isPolygon,
  layerId
} from "../maplibre";
import { cfg, map } from "../config";
import {
  CircleLayer,
  FillLayer,
  GeoJSON,
  LineLayer,
  Popup
} from "svelte-maplibre";
$:
  gj = addLineStringEndpoints($gjSchemeCollection);
const hideWhileEditing = [
  "!=",
  ["get", "hide_while_editing"],
  true
];
const notEndpoint = [
  "!=",
  ["get", "endpoint"],
  true
];
$:
  clickable = $mode.mode == "list";
$:
  showSchemes = getShowSchemes($hideSchemes);
function getShowSchemes(schemesToHide) {
  let expression = ["all"];
  for (let x of schemesToHide.keys()) {
    expression.push(["!=", ["get", "scheme_reference"], x]);
  }
  return expression;
}
let color;
$: {
  let fadeColor = "grey";
  if ($mode.mode == "edit-form") {
    color = ["case", ["==", ["id"], $mode.id], colorInterventions, fadeColor];
  } else if ($mode.mode == "list") {
    color = colorInterventions;
  } else if ($mode.mode == "split-route") {
    color = [
      "case",
      ["==", "intervention_type", "route"],
      // @ts-ignore Can't figure out the problem
      colorInterventions,
      fadeColor
    ];
  } else {
    color = fadeColor;
  }
}
$:
  colorInterventions = colorByScheme($gjSchemeCollection);
function colorByScheme(gj2) {
  return constructMatchExpression(
    ["get", "scheme_reference"],
    Object.fromEntries(
      Object.values(gj2.schemes).map((scheme) => [
        scheme.scheme_reference,
        scheme.color
      ])
    ),
    "black"
  );
}
function onClick(e) {
  if ($mode.mode != "list" || !$map) {
    return;
  }
  if (e.detail.features[0]) {
    $map.getCanvas().style.cursor = "inherit";
    mode.set({ mode: "edit-form", id: e.detail.features[0].id });
  }
}
function tooltip(features) {
  if (features) {
    let feature = features[0];
    let featureName = cfg.interventionName(feature);
    let schemeName = cfg.schemeName(
      $gjSchemeCollection.schemes[feature.properties.scheme_reference]
    );
    return `${featureName} (${schemeName})`;
  }
  return "Tooltip bug";
}
</script>

<GeoJSON data={gj}>
  <CircleLayer
    {...layerId("interventions-points")}
    filter={["all", isPoint, hideWhileEditing, notEndpoint, showSchemes]}
    paint={{
      "circle-color": color,
      "circle-radius": circleRadius,
    }}
    hoverCursor={clickable ? "pointer" : undefined}
    on:click={onClick}
    manageHoverState={clickable}
  >
    {#if clickable}
      <Popup openOn="hover" openIfTopMost let:features>
        <div class="govuk-prose"><p>{tooltip(features)}</p></div>
      </Popup>
    {/if}
  </CircleLayer>

  <LineLayer
    {...layerId("interventions-lines")}
    filter={["all", isLine, hideWhileEditing, showSchemes]}
    paint={{
      "line-color": color,
      "line-width": lineWidth,
    }}
    hoverCursor={clickable ? "pointer" : undefined}
    on:click={onClick}
    manageHoverState={clickable}
  >
    {#if clickable}
      <Popup openOn="hover" openIfTopMost let:features>
        <div class="govuk-prose"><p>{tooltip(features)}</p></div>
      </Popup>
    {/if}
  </LineLayer>
  <CircleLayer
    {...layerId("interventions-lines-endpoints")}
    filter={["all", ["==", ["get", "endpoint"], true], showSchemes]}
    paint={{
      "circle-radius": 0.5 * lineWidth,
      "circle-opacity": 0,
      "circle-stroke-color": colors.lineEndpointColor,
      "circle-stroke-width": 2.0,
    }}
  />

  <FillLayer
    {...layerId("interventions-polygons")}
    filter={["all", isPolygon, hideWhileEditing, showSchemes]}
    paint={{
      "fill-color": color,
      "fill-opacity": 0.2,
    }}
    hoverCursor={clickable ? "pointer" : undefined}
    on:click={onClick}
    manageHoverState={clickable}
  >
    {#if clickable}
      <Popup openOn="hover" openIfTopMost let:features>
        <div class="govuk-prose"><p>{tooltip(features)}</p></div>
      </Popup>
    {/if}
  </FillLayer>
  <LineLayer
    {...layerId("interventions-polygons-outlines")}
    filter={["all", isPolygon, hideWhileEditing, showSchemes]}
    paint={{
      "line-color": color,
      "line-opacity": 0.5,
      "line-width": 0.7 * lineWidth,
    }}
  />
</GeoJSON>
