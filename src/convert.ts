import {Cell as JupyterCell, JupyterNotebook} from "./nbformat/v4";
import {NotebookContent, Cell as StarboardCell} from 'starboard-notebook/dist/src/types';
import { reverseTranslateMagics, translateMagics } from "./converters/magic";
import { convertKatexToMathJax, convertLatexBlocksInMarkdown, convertMathjaxToKatex } from "./converters/latex";
import { JUPYSTAR_VERSION } from "./version";
import { getJupystarOptions, JupystarOptions } from "./options";
import { convertStarboardCellTypeIntoJupyterCellType } from "./converters/cellType";

export function guessStarboardCellType(cell: JupyterCell, nb: JupyterNotebook) {
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
        cellType: guessStarboardCellType(cell, nb),
        id: cell.id,
        textContent: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
        metadata: {
            id: cell.id,
            properties: {},
            ...cell.metadata
        }
    };
 
    translateMagics(c);
    convertMathjaxToKatex(c);

    if (opts.convertLatexBlocks) {
        convertLatexBlocksInMarkdown(c);
    }

    return c;
}

export function convertStarboardCellToJupyterCell(cell: StarboardCell, nb: NotebookContent, opts: JupystarOptions): JupyterCell {
    // Poor man's copy.. to be improved
    const c: StarboardCell = JSON.parse(JSON.stringify(cell))

    reverseTranslateMagics(c);
    convertKatexToMathJax(c);
    convertStarboardCellTypeIntoJupyterCellType(c);

    delete c.metadata.id;
    if (Object.entries(c.metadata.properties).length === 0) {
        delete (c.metadata as any).properties;
    }

    const source = c.textContent.split("\n");
    const numLines = source.length;

    for (let i = 0; i < numLines -1 ; i++) {
        source[i] += "\n";
    }


    const jc: JupyterCell = {
        cell_type: c.cellType as "markdown" | "code" | "raw",
        id: c.id,
        metadata: {
            ...c.metadata,
        },
        source: source,
        ...((c.cellType === "code" ? {outputs: [], execution_count: null} : {}) as any)
    };

    return jc;
}

export function convertJupyterToStarboard(jnb: JupyterNotebook, partialOpts: Partial<JupystarOptions>) {
    const fullOpts = getJupystarOptions(partialOpts);
    const notebookData: NotebookContent = {
        metadata: {
            ipynb_metadata: jnb.metadata,
            jupystar: {
                ...(jnb.metadata.jupystar as object || {}),
                version: JUPYSTAR_VERSION}
        },
        cells: jnb.cells.map(c => convertJupyterCellToStarboardCell(c, jnb, fullOpts))
    };

    return notebookData;
}


export function convertStarboardToJupyter(snb: NotebookContent, partialOpts: Partial<JupystarOptions>) {
    const fullOpts = getJupystarOptions(partialOpts);
    const notebookData: JupyterNotebook = {
        metadata: {
            ...snb.metadata.ipynb_metadata,
            jupystar: {
                version: JUPYSTAR_VERSION
            }
        },
        cells: snb.cells.map(c => convertStarboardCellToJupyterCell(c, snb, fullOpts)),
        nbformat: 4,
        nbformat_minor: 5,
    };

    return notebookData;
}