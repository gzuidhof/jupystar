import { notebookContentToText } from "starboard-notebook/dist/src/content/serialization";
import { convertJupyterToStarboard } from "./convert";
import { parseJupyterNotebook } from "./parseJupyter";

export { convertJupyterToStarboard } from "./convert";
export { notebookContentToText} from "starboard-notebook/dist/src/content/serialization"
export { parseJupyterNotebook } from "./parseJupyter";

/**
 * End to end conversion from Jupyter notebook file (ipynb) to Starboard notebook format.
 */
export function convertJupyterStringToStarboardString(content: string) {
    const j = parseJupyterNotebook(content);
    const sb = convertJupyterToStarboard(j);
    return notebookContentToText(sb);
}
