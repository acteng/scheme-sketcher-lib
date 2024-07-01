import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: Record<string, never>;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type InterventionLayerProps = typeof __propDef.props;
export type InterventionLayerEvents = typeof __propDef.events;
export type InterventionLayerSlots = typeof __propDef.slots;
export default class InterventionLayer extends SvelteComponent<InterventionLayerProps, InterventionLayerEvents, InterventionLayerSlots> {
}
export {};
