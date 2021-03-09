import { Cell } from "starboard-notebook/dist/src/types";

/**
 * This comments out %magic commands, and handles some of them that signify a cell type.
 * The input cell is mutated.
 * @param cell 
 */
export function translateMagics(cell: Cell) {
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

/**
 * This uncomments out %magic commands
 * The input cell is mutated.
 * @param cell 
 */
export function reverseTranslateMagics(cell: Cell) {
    const lines = cell.textContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];

        l.replace("# jupystar-ignored-line-magic: ", "");
        if (l.startsWith("<!-- jupystar-ignored-line-magic: ")) {
            l.replace("<!-- jupystar-ignored-line-magic: ", "");
            l.replace("-->", "");
        }
        l.replace("// jupystar-ignored-line-magic: ", "");
    }
    cell.textContent = lines.join("\n");
}