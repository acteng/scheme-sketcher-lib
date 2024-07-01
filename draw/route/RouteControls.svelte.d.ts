import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        extendRoute: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RouteControlsProps = typeof __propDef.props;
export type RouteControlsEvents = typeof __propDef.events;
export type RouteControlsSlots = typeof __propDef.slots;
export default class RouteControls extends SvelteComponent<RouteControlsProps, RouteControlsEvents, RouteControlsSlots> {
}
export {};
