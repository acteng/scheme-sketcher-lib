import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        enabled: boolean;
        showControls?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type StreetViewToolProps = typeof __propDef.props;
export type StreetViewToolEvents = typeof __propDef.events;
export type StreetViewToolSlots = typeof __propDef.slots;
export default class StreetViewTool extends SvelteComponent<StreetViewToolProps, StreetViewToolEvents, StreetViewToolSlots> {
}
export {};
