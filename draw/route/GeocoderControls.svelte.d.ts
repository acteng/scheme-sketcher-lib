import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type GeocoderControlsProps = typeof __propDef.props;
export type GeocoderControlsEvents = typeof __propDef.events;
export type GeocoderControlsSlots = typeof __propDef.slots;
export default class GeocoderControls extends SvelteComponent<GeocoderControlsProps, GeocoderControlsEvents, GeocoderControlsSlots> {
}
export {};
