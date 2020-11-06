import {Cell as JupyterCell, Demo as JupyterNotebook} from "./nbformat/v4";
import {NotebookContent, Cell as StarboardCell} from 'starboard-notebook/dist/src/types';
import { translateMagics } from "./converters/magic";
import { convertLatexBlocksInMarkdown, convertMathjaxToKatex } from "./converters/latex";
import { JUPYSTAR_VERSION } from "./version";
import { getJupystarOptions, JupystarOptions } from "./options";

export function guessCellType(cell: JupyterCell, nb: JupyterNotebook) {
    if (cell.cell_type === "raw") {
        return "raw";
    } else if (cell.cell_type === "markdown") {
        return "markdown";
    } else if (cell.cell_type === "code") {
        // TODO read from the Kernel information in the notebook to better guess here
        return "python";
    }
    return "python";
}

export function convertJupyterCellToStarboardCell(cell: JupyterCell, nb: JupyterNotebook, opts: JupystarOptions): StarboardCell {
    const c: StarboardCell = {
        cellType: guessCellType(cell, nb),
        id: "", // It doesn't matter as these are not persisted anyway
        textContent: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
        metadata: {
            properties: {}
        }
    };

    translateMagics(c);
    convertMathjaxToKatex(c);

    if (opts.convertLatexBlocks) {
        convertLatexBlocksInMarkdown(c);
    }

    return c;
}

export function convertJupyterToStarboard(jnb: JupyterNotebook, partialOpts: Partial<JupystarOptions>) {
    const fullOpts = getJupystarOptions(partialOpts);
    const notebookData: NotebookContent = {
        metadata: {
            jupystar: {...(jnb.metadata.jupystar as object || {}), version: JUPYSTAR_VERSION}
        },
        cells: jnb.cells.map(c => convertJupyterCellToStarboardCell(c, jnb, fullOpts))
    };

    return notebookData;
}
