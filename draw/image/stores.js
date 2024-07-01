import { writable } from "svelte/store";
// Use this to share between two components, nested under the sidebar and map
export const imgSrc = writable(null);
export const opacity = writable(100);
