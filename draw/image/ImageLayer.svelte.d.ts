import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ImageLayerProps = typeof __propDef.props;
export type ImageLayerEvents = typeof __propDef.events;
export type ImageLayerSlots = typeof __propDef.slots;
export default class ImageLayer extends SvelteComponent<ImageLayerProps, ImageLayerEvents, ImageLayerSlots> {
}
export {};
