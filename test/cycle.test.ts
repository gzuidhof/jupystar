import {readJSONSync} from "fs-extra";
import {convertJupyterToStarboard, convertStarboardToJupyter} from "../src/convert"
import { JupyterNotebook } from "../src/nbformat/v4";

describe("Conversion back and forth repeatedly", () => {
    const ipynb: JupyterNotebook = readJSONSync("./fixtures/advanced/haiku-and-squares.ipynb");

    // Remove outputs from input notebook file as these won't be preserved
    ipynb.cells.forEach(cell => {
        if (cell.cell_type === "code") {
            cell.outputs = []
            cell.execution_count = null;
        }
    });

    test("Ipynb->Starboard->Ipynb", () => {
        const starboardContent = convertJupyterToStarboard(ipynb, {})
        const ipynbAgain = convertStarboardToJupyter(starboardContent, {});

        // The jupystar metadata is added by Jupystar itself, so it won't be present in the original.
        delete ipynbAgain.metadata.jupystar;

        expect(ipynbAgain).toEqual(ipynb);
    })
});