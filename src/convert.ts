import {Cell as JupyterCell, Demo as JupyterNotebook} from "./nbformat/v4";
import {NotebookContent, Cell as StarboardCell} from 'starboard-notebook/dist/src/types';
import {generateUniqueCellId} from 'starboard-notebook/dist/src/components/helpers/random';


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

/**
 * This comments out %magic commands, and handles some of them that signify a cell type.
 * The input cell is mutated.
 * @param cell 
 */
export function translateMagics(cell: StarboardCell) {
    const lines = cell.textContent.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        if (l.trim().startsWith("%")) {
            const magic = l.trim().split(" ")[0];
            if (magic.substr(0, 2) === "%%") { // This is a cell magic, like %%latex
                let newCellType = magic.substr(2).toLowerCase();
                // Some cell types can be handled more smartly - or have an alias that is preferred
                if (newCellType === "svg") {
                    newCellType = "html";
                } else if (newCellType === "python3") {
                    newCellType = "python";
                } else if (newCellType === "js") {
                    newCellType = "javascript";
                }
                cell.cellType = newCellType;
                lines.splice(i, 1); // Drop this line
            } else { // it's a normal magic string.. we just comment them for now
                if (cell.cellType === "python" || cell.cellType === "pypy") {
                    lines[i] = "# jupystar-ignored-line-magic: " + lines[i];
                } else if (cell.cellType === "html") {
                    lines[i] = "<!-- jupystar-ignored-line-magic: " + lines[i]; + " -->";
                } else if (cell.cellType === "javascript") {
                    lines[i] = "// jupystar-ignored-line-magic: " + lines[i];
                }
            }
        }
    }
    cell.textContent = lines.join("\n");
}

export function convertJupyterCellToStarboardCell(cell: JupyterCell, nb: JupyterNotebook): StarboardCell {
    const c: StarboardCell = {
        cellType: guessCellType(cell, nb),
        id: "", // It doesn't matter as these are not persisted anyway
        textContent: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
        metadata: {
            properties: {}
        }
    };
    translateMagics(c);
    return c;
}

export function convertJupyterToStarboard(jnb: JupyterNotebook) {
    const notebookData: NotebookContent = {
        metadata: {
            jupystar: jnb.metadata.jupystar || {}
        },
        cells: jnb.cells.map(c => convertJupyterCellToStarboardCell(c, jnb))
    };

    return notebookData;
}
