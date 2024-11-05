import { writable, type Writable } from "svelte/store";

// These are necessary to communicate between components nested under the sidebar and map

export const position: Writable<[number, number] | null> = writable(null);
