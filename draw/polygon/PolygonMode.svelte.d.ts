import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PolygonModeProps = typeof __propDef.props;
export type PolygonModeEvents = typeof __propDef.events;
export type PolygonModeSlots = typeof __propDef.slots;
export default class PolygonMode extends SvelteComponent<PolygonModeProps, PolygonModeEvents, PolygonModeSlots> {
}
export {};
