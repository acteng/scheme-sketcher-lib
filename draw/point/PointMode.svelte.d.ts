import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PointModeProps = typeof __propDef.props;
export type PointModeEvents = typeof __propDef.events;
export type PointModeSlots = typeof __propDef.slots;
export default class PointMode extends SvelteComponent<PointModeProps, PointModeEvents, PointModeSlots> {
}
export {};
