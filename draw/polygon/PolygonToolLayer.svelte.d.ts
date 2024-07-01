import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PolygonToolLayerProps = typeof __propDef.props;
export type PolygonToolLayerEvents = typeof __propDef.events;
export type PolygonToolLayerSlots = typeof __propDef.slots;
export default class PolygonToolLayer extends SvelteComponent<PolygonToolLayerProps, PolygonToolLayerEvents, PolygonToolLayerSlots> {
}
export {};
