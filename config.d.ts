/// <reference types="svelte" />
import type { FeatureWithAnyProps, SchemeData } from "./draw/types";
import type { Feature, LineString, Polygon, Point } from "geojson";
import { type Writable } from "svelte/store";
import type { Map } from "maplibre-gl";
export declare let map: Writable<Map | null>;
export declare const mapStyle: Writable<string>;
export declare let cfg: {
    interventionName: (f: FeatureWithAnyProps) => any;
    schemeName: (s: SchemeData) => string;
    newPointFeature: (f: Feature<Point>) => void;
    newPolygonFeature: (f: Feature<Polygon>) => void;
    newLineStringFeature: (f: Feature<LineString>) => void;
    updateFeature: (destination: FeatureWithAnyProps, source: FeatureWithAnyProps) => void;
};
