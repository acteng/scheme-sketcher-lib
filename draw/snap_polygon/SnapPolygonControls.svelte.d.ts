import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SnapPolygonControlsProps = typeof __propDef.props;
export type SnapPolygonControlsEvents = typeof __propDef.events;
export type SnapPolygonControlsSlots = typeof __propDef.slots;
export default class SnapPolygonControls extends SvelteComponent<SnapPolygonControlsProps, SnapPolygonControlsEvents, SnapPolygonControlsSlots> {
}
export {};
