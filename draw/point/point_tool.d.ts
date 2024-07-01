import type { Feature, Point } from "geojson";
import type { Map, MapMouseEvent } from "maplibre-gl";
export declare class PointTool {
    map: Map;
    active: boolean;
    eventListenersSuccess: ((f: Feature<Point>) => void)[];
    eventListenersFailure: (() => void)[];
    cursor: Feature<Point> | null;
    onMouseMove: (e: MapMouseEvent) => void;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    constructor(map: Map);
    tearDown(): void;
    cancel(): void;
    addEventListenerSuccess(callback: (f: Feature<Point>) => void): void;
    addEventListenerFailure(callback: () => void): void;
    clearEventListeners(): void;
    start(): void;
    stop(): void;
}
