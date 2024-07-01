import { emptyGeojson } from "../../maplibre";
import { writable } from "svelte/store";
// These are necessary to communicate between components nested under the sidebar and map
export const routeToolGj = writable(emptyGeojson());
export const geocoderGj = writable(emptyGeojson());
export const snapMode = writable(true);
export const undoLength = writable(0);
