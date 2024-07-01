import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        routeSnapperUrl: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type PerModeControlsProps = typeof __propDef.props;
export type PerModeControlsEvents = typeof __propDef.events;
export type PerModeControlsSlots = typeof __propDef.slots;
export default class PerModeControls extends SvelteComponent<PerModeControlsProps, PerModeControlsEvents, PerModeControlsSlots> {
}
export {};
