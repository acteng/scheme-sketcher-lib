export const colors = {
    hovering: "black",
    lineEndpointColor: "black",
};
// For points
export const circleRadius = 10;
// For line-strings
export const lineWidth = 10;
export function randomSchemeColor() {
    return pickRandom(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);
}
function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}
