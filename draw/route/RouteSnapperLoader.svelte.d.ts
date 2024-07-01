import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        url: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type RouteSnapperLoaderProps = typeof __propDef.props;
export type RouteSnapperLoaderEvents = typeof __propDef.events;
export type RouteSnapperLoaderSlots = typeof __propDef.slots;
export default class RouteSnapperLoader extends SvelteComponent<RouteSnapperLoaderProps, RouteSnapperLoaderEvents, RouteSnapperLoaderSlots> {
}
export {};
