export { getRoadLayerNames } from "./highlight_roads";
export { layerId } from "./zorder";
import type { FeatureCollection, GeoJSON } from "geojson";
import type { DataDrivenPropertyValueSpecification, ExpressionSpecification } from "maplibre-gl";
export declare const isPolygon: ExpressionSpecification;
export declare const isLine: ExpressionSpecification;
export declare const isPoint: ExpressionSpecification;
export declare function emptyGeojson(): FeatureCollection;
export declare function constructMatchExpression<OutputType>(getter: any[], map: {
    [name: string]: OutputType;
}, fallback: OutputType): DataDrivenPropertyValueSpecification<OutputType>;
export declare function bbox(gj: GeoJSON): [number, number, number, number];
export declare function addLineStringEndpoints(input: FeatureCollection): FeatureCollection;
