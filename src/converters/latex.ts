import {Cell} from "starboard-notebook/dist/src/types";

// https://github.com/KaTeX/KaTeX/wiki/Things-that-KaTeX-does-not-%28yet%29-support#mathjax-non-standard-functions
// and https://katex.org/docs/support_table.html
const MATHJAX_TO_LATEX_SUBSTITUTIONS = {
    "\\array": "\\begin{array}",
    "\\cases": "\\begin{cases}",
    "\\Rule": "\\rule",
    "\\Space": "\\space",
    "\\Tiny": "\\tiny",
    "{align}": "{aligned}",
    "{alignat}": "{alignedat}",
    "{equation}": "{aligned}", // Not necessarily the correct translation..
    "\\class": "\\htmlClass",
    "\\cssId": "\\htmlId",
    "\\style": "\\htmlStyle", 
}

// One or two $ as the only thing on the line (and some possible whitespace)
const DELIMITER_LINE_REGEX = /^\s*\${1,2}\s*$/;
const BEGIN_REGEX = /(\${0,2})\s*\\begin{[a-zA-Z0-9]*}/;
const END_REGEX = /\\end{[a-zA-Z0-9]*}\s*(\${0,2})/;

export function convertMathjaxToKatex(cell: Cell) {
    if (cell.cellType !== "latex" && cell.cellType !== "markdown") {
        return;
    }

    const substitutions = Object.entries(MATHJAX_TO_LATEX_SUBSTITUTIONS);
    const lines = cell.textContent.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        for(const [orig, repl] of substitutions) {
            if (l.indexOf(orig) !== -1) {
                lines[i] = l.replace(orig, repl);
            }
        }
    }
    cell.textContent = lines.join("\n");
}


/**
 * Searches the lines before or after specified index, skipping empty lines.
 * The first line found that is not empty contains $ or $$, it returns true, otherwise it returns false
 */
function hasLatexDelimiterLine(lines: string[], index: number, where: "before" | "after") {
    for (let i = index; i < lines.length && i >= 0; where === "before" ? i-- : i++) {
        const l = lines[i];
        if (l.trim() === "") {
            continue;
        }
        return DELIMITER_LINE_REGEX.test(l);
    }
}

/**
 * In Jupyter notebooks you can specify a block as 
 * \begin{...}
 * a = 1 + 2
 * \end{...}
 * 
 * $$  G_0 \frac{1}{\sqrt{2}} \left[ \begin{array}{c}  1 \\ 1  \end{array} \right] + 
 * G_1 \frac{1}{\sqrt{2}} \left[ \begin{array}{c}  1 \\ -1  \end{array} \right] $$
 * 
 * 
 * 
 * This is not valid in Starboard (for good reason), here we do a best effort add $$ around it.
 */
export function convertLatexBlocksInMarkdown(cell: Cell) {
    if (cell.cellType !== "markdown") {
        return;
    }
    const lines = cell.textContent.split("\n");

    let currentlyInLatexBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const lt = l.trim();

        if (lt.startsWith("$$")) {
            currentlyInLatexBlock = !currentlyInLatexBlock;
        }
        if (lt.length > 2 && lt.endsWith("$$")) {
            currentlyInLatexBlock = !currentlyInLatexBlock;
        }

        if (currentlyInLatexBlock) {
            continue;
        }

        const b = BEGIN_REGEX.exec(l);
        if (b !== null) {
            const delimiterMatch = b[1]; // $ or $$ is already present before it if this is not undefined
            if (!delimiterMatch && lt.indexOf("$") === -1) {
                // if (!hasLatexDelimiterLine(lines, i, "before")) { // Not actually necessary it seems with the startsWith and endsWith checks above
                    lines[i] = "$$" + lines[i];
                // }
            }
        }

        const e = END_REGEX.exec(l);
        if (e !== null) {
            const delimiterMatch = e[1]; // $ or $$ is already present before it if this is not undefined
            if (!delimiterMatch && lt.indexOf("$") === -1) {
                // if (!hasLatexDelimiterLine(lines, i, "after")) {
                    lines[i] = lines[i] + "$$";
                // }
            }
        }
    }
    cell.textContent = lines.join("\n");
}