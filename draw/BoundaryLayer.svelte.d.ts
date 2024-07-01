import { SvelteComponent } from "svelte";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
declare const __propDef: {
    props: {
        boundaryGeojson: Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon>;
        fitBoundsAtStart?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type BoundaryLayerProps = typeof __propDef.props;
export type BoundaryLayerEvents = typeof __propDef.events;
export type BoundaryLayerSlots = typeof __propDef.slots;
export default class BoundaryLayer extends SvelteComponent<BoundaryLayerProps, BoundaryLayerEvents, BoundaryLayerSlots> {
}
export {};
