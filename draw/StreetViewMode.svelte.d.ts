import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type StreetViewModeProps = typeof __propDef.props;
export type StreetViewModeEvents = typeof __propDef.events;
export type StreetViewModeSlots = typeof __propDef.slots;
export default class StreetViewMode extends SvelteComponent<StreetViewModeProps, StreetViewModeEvents, StreetViewModeSlots> {
}
export {};
