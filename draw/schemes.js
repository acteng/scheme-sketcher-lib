import { v4 as uuidv4 } from "uuid";
import { randomSchemeColor } from "./colors";
export function emptyCollection() {
    let gj = {
        type: "FeatureCollection",
        features: [],
        schemes: {},
    };
    addEmptyScheme(gj);
    return gj;
}
export function addEmptyScheme(gj) {
    let scheme_reference = uuidv4();
    gj.schemes[scheme_reference] = {
        scheme_reference,
        color: randomSchemeColor(),
    };
    // TODO Give a hook for user to backfill / set up defaults here?
}
