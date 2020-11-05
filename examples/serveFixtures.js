
const express = require('express')
const jsesc = require('jsesc');
const fs = require('fs');
const app = express()
const port = 3000

const cdn = `https://unpkg.com/starboard-notebook@0.6.0/dist/`;

app.get("/:href(*)", (req, res) => {
    const fixturePath = req.params.href;

    if (fixturePath === "" || fixturePath.indexOf(".sbnb") == -1) {
        res.send("Specify the path from the fixtures folder");
        return;
    }

    const nbContent = fs.readFileSync("output/fixtures/" + fixturePath).toString();
    const escapedNb = jsesc(nbContent, {quotes: "backtick", minimal: true, es6: true, isScriptContext: true});;
    
  res.send(`
  <!doctype html>
  <html>
      <head>
          <meta charset="utf-8">
          <title>Starboard Notebook Embed</title>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <link rel="icon" href="${cdn}/favicon.ico">
          <link href="${cdn}/starboard-notebook.css" rel="stylesheet">
      </head>
      <body>
          <script>
              window.initialNotebookContent = \`${escapedNb}\`;
              window.starboardArtifactsUrl = \`${cdn}/\`;
          </script>
          <script src="${cdn}/starboard-notebook.js"></script>
      </body>
  </html>
`)
})

app.listen(port, () => {
  console.log(`Starboard Notebook fixtures view app listening at http://localhost:${port}`)
})
