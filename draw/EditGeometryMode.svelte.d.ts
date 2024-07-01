import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        id: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type EditGeometryModeProps = typeof __propDef.props;
export type EditGeometryModeEvents = typeof __propDef.events;
export type EditGeometryModeSlots = typeof __propDef.slots;
export default class EditGeometryMode extends SvelteComponent<EditGeometryModeProps, EditGeometryModeEvents, EditGeometryModeSlots> {
}
export {};
