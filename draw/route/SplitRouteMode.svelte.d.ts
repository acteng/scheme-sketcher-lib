import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SplitRouteModeProps = typeof __propDef.props;
export type SplitRouteModeEvents = typeof __propDef.events;
export type SplitRouteModeSlots = typeof __propDef.slots;
export default class SplitRouteMode extends SvelteComponent<SplitRouteModeProps, SplitRouteModeEvents, SplitRouteModeSlots> {
}
export {};
