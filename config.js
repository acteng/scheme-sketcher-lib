import { newFeatureId, getArbitrarySchemeRef, gjSchemeCollection, } from "./draw/stores";
import { get, writable } from "svelte/store";
export let map = writable(null);
export const mapStyle = writable("dataviz");
// The draw code should be agnostic to the feature properties that differ by
// schema. Start centralizing the logic here, so it's easy for other users to
// override.
// TODO As an alternate idea, users could implement a custom Svelte store with methods for doing these things
export let cfg = {
    interventionName: (f) => {
        return f.properties.name || `Untitled ${f.geometry.type}`;
    },
    schemeName: (s) => {
        return `scheme ${s.scheme_reference}`;
    },
    newPointFeature: (f) => {
        gjSchemeCollection.update((gj) => {
            f.id = newFeatureId(gj);
            f.properties ||= {};
            f.properties.scheme_reference = getArbitrarySchemeRef(gj);
            gj.features.push(f);
            return gj;
        });
    },
    newPolygonFeature: (f) => {
        gjSchemeCollection.update((gj) => {
            f.id = newFeatureId(gj);
            f.properties ||= {};
            f.properties.scheme_reference = getArbitrarySchemeRef(gj);
            gj.features.push(f);
            return gj;
        });
    },
    newLineStringFeature: (f) => {
        gjSchemeCollection.update((gj) => {
            f.id = newFeatureId(gj);
            f.properties ||= {};
            f.properties.scheme_reference = getArbitrarySchemeRef(gj);
            gj.features.push(f);
            return gj;
        });
    },
    updateFeature: (destination, source) => {
        // Don't do anything by default
    },
};
