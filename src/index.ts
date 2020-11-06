import { notebookContentToText } from "starboard-notebook/dist/src/content/serialization";
import { convertJupyterToStarboard } from "./convert";
import { JupystarOptions } from "./options";
import { parseJupyterNotebook } from "./parseJupyter";

export { convertJupyterToStarboard } from "./convert";
export { notebookContentToText} from "starboard-notebook/dist/src/content/serialization"
export { parseJupyterNotebook } from "./parseJupyter";
export { JUPYSTAR_VERSION } from "./version";

/**
 * End to end conversion from Jupyter notebook file (ipynb) to Starboard notebook format.
 */
export function convertJupyterStringToStarboardString(content: string, opts: Partial<JupystarOptions> = {}) {
    const j = parseJupyterNotebook(content);
    const sb = convertJupyterToStarboard(j, opts);
    return notebookContentToText(sb);
}
