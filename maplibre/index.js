export { getRoadLayerNames } from "./highlight_roads";
export { layerId } from "./zorder";
// Helpers for https://maplibre.org/maplibre-gl-js-docs/style-spec/
import turfBbox from "@turf/bbox";
export const isPolygon = [
    "==",
    ["geometry-type"],
    "Polygon",
];
export const isLine = [
    "==",
    ["geometry-type"],
    "LineString",
];
export const isPoint = [
    "==",
    ["geometry-type"],
    "Point",
];
export function emptyGeojson() {
    return {
        type: "FeatureCollection",
        features: [],
    };
}
// Helper for https://maplibre.org/maplibre-style-spec/expressions/#match.
// Gets one feature property, uses a map to match a key to a value, and
// includes a fallback if no keys match.
export function constructMatchExpression(getter, map, fallback) {
    let x = ["match", getter];
    for (let [key, value] of Object.entries(map)) {
        x.push(key);
        x.push(value);
    }
    x.push(fallback);
    return x;
}
// Suitable for passing to map.fitBounds. Work around https://github.com/Turfjs/turf/issues/1807.
export function bbox(gj) {
    return turfBbox(gj);
}
// Returns all the input features, additionally with a new point for every
// LineString endpoint, with an endpoint=true property. Note this drops any
// foreign members on the input, and that it reuses object references of the
// input for performance, rather than making a defensive deep copy.
export function addLineStringEndpoints(input) {
    let output = {
        type: "FeatureCollection",
        features: [],
    };
    // Add points for the ends of every LineString
    for (let f of input.features) {
        output.features.push(f);
        if (f.geometry.type == "LineString" && !f.properties?.hide_while_editing) {
            for (let pt of [
                f.geometry.coordinates[0],
                f.geometry.coordinates[f.geometry.coordinates.length - 1],
            ]) {
                output.features.push({
                    type: "Feature",
                    properties: {
                        endpoint: true,
                        scheme_reference: f.properties?.scheme_reference,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: pt,
                    },
                });
            }
        }
    }
    return output;
}
