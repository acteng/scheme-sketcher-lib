import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type HoverLayerProps = typeof __propDef.props;
export type HoverLayerEvents = typeof __propDef.events;
export type HoverLayerSlots = typeof __propDef.slots;
export default class HoverLayer extends SvelteComponent<HoverLayerProps, HoverLayerEvents, HoverLayerSlots> {
}
export {};
