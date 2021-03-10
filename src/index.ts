import { notebookContentToText } from "starboard-notebook/dist/src/content/serialization";
import { textToNotebookContent } from "starboard-notebook/dist/src/content/parsing";
import { convertJupyterToStarboard, convertStarboardToJupyter } from "./convert";
import { JupystarOptions } from "./options";
import { parseJupyterNotebook } from "./parseJupyter";

export { convertJupyterToStarboard } from "./convert";
export { notebookContentToText} from "starboard-notebook/dist/src/content/serialization"
export { parseJupyterNotebook } from "./parseJupyter";
export { JUPYSTAR_VERSION } from "./version";

/**
 * End to end conversion from Jupyter notebook file (ipynb) to Starboard notebook format.
 */
export function convertJupyterStringToStarboardString(content: string, opts: Partial<JupystarOptions> = {}): string {
    const j = parseJupyterNotebook(content);
    const sb = convertJupyterToStarboard(j, opts);
    return notebookContentToText(sb);
}

/**
 * End to end conversion from Starboard notebook format to Jupyter notebook format (ipynb).
 */
export function convertStarboardStringToJupyterString(content: string, opts: Partial<JupystarOptions> = {}): string {
    const sbContent = textToNotebookContent(content);
    const ipynb = convertStarboardToJupyter(sbContent, opts);
    return JSON.stringify(ipynb, null, 2)
}
