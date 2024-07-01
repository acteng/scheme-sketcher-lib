import { v4 as uuidv4 } from "uuid";
import { randomSchemeColor } from "./colors";
import type { SchemeCollection } from "./types";

export function emptyCollection(): SchemeCollection {
  let gj = {
    type: "FeatureCollection" as const,
    features: [],
    schemes: {},
  };
  addEmptyScheme(gj);
  return gj;
}

export function addEmptyScheme(gj: SchemeCollection) {
  let scheme_reference = uuidv4();
  gj.schemes[scheme_reference] = {
    scheme_reference,
    color: randomSchemeColor(),
  };
  // TODO Give a hook for user to backfill / set up defaults here?
}
