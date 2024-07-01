export { default as Modal } from "./Modal.svelte";
export { default as StreetViewHelp } from "./StreetViewHelp.svelte";
export { default as StreetViewTool } from "./StreetViewTool.svelte";
export { default as WarningIcon } from "./WarningIcon.svelte";

// Fetch a URL and return bytes. Along the way, calls setProgress with a number [0, 100] -- but sometimes over 100 when the file is compressed. This function will throw if the server doesn't send back a Content-Length header.
export async function fetchWithProgress(
  url: string,
  setProgress: (progress: number) => void,
): Promise<Uint8Array> {
  let response = await fetch(url);
  // TODO Handle error cases better
  let reader = response.body!.getReader();

  let lengthHeader = response.headers.get("Content-Length");
  if (!lengthHeader) {
    throw new Error(`No Content-Length header from ${url}`);
  }
  let contentLength = parseInt(lengthHeader);

  let receivedLength = 0;
  let chunks = [];
  while (true) {
    let { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (value) {
      chunks.push(value);
      receivedLength += value.length;

      setProgress((100.0 * receivedLength) / contentLength);
    }
  }

  let allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  return allChunks;
}
