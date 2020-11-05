const fs = require("fs");
const jupystar = require("../dist/index.cjs");


const fixtures = [
    "/advanced/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers-Chapter-1.ipynb"
]

const outputFolder = "./output/fixtures";
fs.mkdirSync(outputFolder, {recursive: true});

for (const fixt of fixtures) {
    const f = fs.readFileSync(`../fixtures${fixt}`);
    const jupyterText = f.toString();
    const starboardText = jupystar.convertJupyterStringToStarboardString(jupyterText);

    const outputPath = fixt.lastIndexOf("/") !== -1 ? fixt.substring(0, fixt.lastIndexOf("/")) : "";

    fs.mkdirSync(outputFolder + outputPath, {recursive: true});
    fs.writeFileSync(`${outputFolder}${fixt.replace(".ipynb", ".sbnb")}`, starboardText);
}
