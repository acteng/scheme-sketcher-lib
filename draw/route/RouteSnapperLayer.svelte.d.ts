import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RouteSnapperLayerProps = typeof __propDef.props;
export type RouteSnapperLayerEvents = typeof __propDef.events;
export type RouteSnapperLayerSlots = typeof __propDef.slots;
export default class RouteSnapperLayer extends SvelteComponent<RouteSnapperLayerProps, RouteSnapperLayerEvents, RouteSnapperLayerSlots> {
}
export {};
