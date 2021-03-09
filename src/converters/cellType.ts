import { Cell } from "starboard-notebook/dist/src/types";

/**
 * Takes a given Starboard cell and changes its type to
 * "raw", "markdown" or "code"
 * This modifies the input cell.
 * 
 * @param cell
 */
export function convertStarboardCellTypeIntoJupyterCellType(cell: Cell) {
    const ct = cell.cellType;

    if (ct === "markdown" || ct === "raw") {
        return;
    } else if (ct === "html") {
        cell.cellType = "code";
        cell.textContent = "%%html\n" + cell.textContent;
    } else if (ct === "python") {
        cell.cellType = "code";
    } else if (ct === "svg") {
        cell.cellType = "code";
        cell.textContent = "%%svg\n" + cell.textContent;
    } else if (ct === "javascript") {
        cell.cellType = "code";
        cell.textContent = "%%javascript\n" + cell.textContent;
    } else if (ct === "latex") {
        cell.cellType = "code";
        cell.textContent = "%%latex\n" + cell.textContent;
    } else {
        console.error(`Cell type \"${ct}\" can not be translated from Starboard Cell to Jupyter, it will be converted to a raw cell`);
        cell.cellType = "raw";
    }
}
