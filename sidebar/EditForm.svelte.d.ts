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
export type EditFormProps = typeof __propDef.props;
export type EditFormEvents = typeof __propDef.events;
export type EditFormSlots = typeof __propDef.slots;
export default class EditForm extends SvelteComponent<EditFormProps, EditFormEvents, EditFormSlots> {
}
export {};
