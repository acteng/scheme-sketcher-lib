import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ImageModeProps = typeof __propDef.props;
export type ImageModeEvents = typeof __propDef.events;
export type ImageModeSlots = typeof __propDef.slots;
export default class ImageMode extends SvelteComponent<ImageModeProps, ImageModeEvents, ImageModeSlots> {
}
export {};
