import {Cell as V3Cell, Demo as V3Notebook} from "./nbformat/v3";
import {Cell as V4Cell, Output as V4Output, Demo as V4Notebook} from "./nbformat/v4";
import {BackwardsCompatibilityError} from "./errors";
import { generateUniqueCellId } from "./random";

/**
 * Parses given string as JSON, and converts it to nbformat v4 if it is currently v3.
 * @param textContent 
 */
export function parseJupyterNotebook(textContent: string): V4Notebook {
    return readIpynbContentFileAsV4(JSON.parse(textContent));
}

function convertV3CellToV4(c: V3Cell): V4Cell {
    // The HTML cell type is now just markdown
    let newCellType = c.cell_type

    // The input field of code cells has been renamed to source
    let newSource = c.cell_type === "code" ? c.input : c.source

    // The HTML cell type no longer exists, a better conversion would be to a code cell
    // with the %%html magic, TODO?
    if (c.cell_type === "html") {
        c.cell_type = "markdown"
    }

    // Convert heading cells to simple markdown cells
    if (c.cell_type === "heading") {
        newCellType = "markdown";
        if (typeof newSource === "string") {
            newSource = [newSource];
        }
        newSource = newSource.map(l => "#".repeat(c.level) + " " + l);
    }

    if (c.cell_type === "code") {
        const outputs = c.outputs.map(o => {
            if (o.output_type === "pyout") {
                const v4Output: V4Output = {
                    ...o,
                    output_type: "execute_result",
                    execution_count: c.prompt_number === undefined ? null : c.prompt_number,
                    metadata: o.metadata || {},
                    data: {}, // TODO actually convert output
                }
                delete (v4Output as any).prompt_number;
                return v4Output;
            }
            else if (o.output_type === "pyerr") {
                const v4Output: V4Output = {
                    ...o,
                    output_type: "error",
                }
                delete (v4Output as any).prompt_number;
                return v4Output;
            }
            else if (o.output_type === "display_data") {
                const v4Output: V4Output = {
                    ...o,
                    output_type: "execute_result",
                    execution_count: c.prompt_number === undefined ? null : c.prompt_number,
                    metadata: o.metadata || {},
                    data: {}, // TODO actually convert output
                }
                delete (v4Output as any).prompt_number;
                return v4Output;
            }
            else if (o.output_type === "stream") {
                const v4Output: V4Output = {
                    ...o,
                    name: o.stream
                }
                delete (v4Output as any).stream;
                return v4Output;
            }
            
            return o;
        });

        const v4CodeCell: V4Cell = {
            ...c,
            outputs,
            id: generateUniqueCellId(), 
            execution_count: c.prompt_number === undefined ? null : c.prompt_number,
            metadata: c.metadata || {},
            source: newSource
        }

        delete (v4CodeCell as any).prompt_number; // Renamed field

        return v4CodeCell;
    } else {
        return {
            ...c,
            id: generateUniqueCellId(), 
            execution_count: null,
            metadata: c.metadata || {},
            cell_type: newCellType as "raw" | "markdown"
        }
    }
}

/**
 * Takes as input a nbformat v3 or v4 notebook JSON, returns it in v4 format.
 */
export function readIpynbContentFileAsV4(nb: V3Notebook | V4Notebook) {

    if (nb.nbformat === 3) {
        // Convert to V4.. well kind of at least!
        if (nb.worksheets.length === 0) {
            throw new BackwardsCompatibilityError("No worksheets are present in this nbformat v3 notebook.");
        }
        const cells: V4Cell[] = nb.worksheets[0].cells.map(convertV3CellToV4);

        const v4Notebook: V4Notebook = {
            ...nb,
            cells,
            metadata: {
                ...nb.metadata,
                jupystar: {
                    "nbformat_original_version": 3
                }
            },
            nbformat: 4,
            nbformat_minor: 0,
        }
        return v4Notebook;
        // (nb as V4Notebook).cells = nb.worksheets[0].cells;
    } else if (nb.nbformat <= 2) {
        throw new BackwardsCompatibilityError("iPython notebooks with nbformat v2 and below are not supported.");
    } else {
        return nb;
    }
}