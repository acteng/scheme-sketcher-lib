import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        editingExisting: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PointControlsProps = typeof __propDef.props;
export type PointControlsEvents = typeof __propDef.events;
export type PointControlsSlots = typeof __propDef.slots;
export default class PointControls extends SvelteComponent<PointControlsProps, PointControlsEvents, PointControlsSlots> {
}
export {};
