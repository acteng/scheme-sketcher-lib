import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RouteModeProps = typeof __propDef.props;
export type RouteModeEvents = typeof __propDef.events;
export type RouteModeSlots = typeof __propDef.slots;
export default class RouteMode extends SvelteComponent<RouteModeProps, RouteModeEvents, RouteModeSlots> {
}
export {};
