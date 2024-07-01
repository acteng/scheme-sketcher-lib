/// <reference types="svelte" />
import type { FeatureCollection } from "@maptiler/geocoding-control/types";
import type { GeoJSON } from "geojson";
import { type Writable } from "svelte/store";
export declare const routeToolGj: Writable<GeoJSON>;
export declare const geocoderGj: Writable<FeatureCollection>;
export declare const snapMode: Writable<boolean>;
export declare const undoLength: Writable<number>;
