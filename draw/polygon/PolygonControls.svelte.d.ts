import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PolygonControlsProps = typeof __propDef.props;
export type PolygonControlsEvents = typeof __propDef.events;
export type PolygonControlsSlots = typeof __propDef.slots;
export default class PolygonControls extends SvelteComponent<PolygonControlsProps, PolygonControlsEvents, PolygonControlsSlots> {
}
export {};
