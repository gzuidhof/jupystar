# jupystar
Convert Jupyter notebooks (ipynb) to Starboard notebooks.

It won't work for all notebooks - but should at least give sensible output that can be adapted easily.

### Implementation details

nbformat (Jupyter's ipynb format) V3 is supported - when Jupystar detects a V3 file it converts it to a V4 format prior to conversion to a Starboard notebook. Some details of this conversion:
* The first worksheet is used, all others are ignored. Also, worksheet metadata is ignored. Worksheets aren't really a thing anymore anyway.
* All output is currently dropped in conversion from v3 to v4.

### LaTeX conversion
Starboard notebook uses KaTeX to display math, which doesn't support the same functionality as MathJax (used in Jupyter).

* We perform a [string replacement for some tags](https://github.com/gzuidhof/jupystar/blob/main/src/converters/latex.ts#L5-L17).
* Equations inside of markdown that are only delimited by `\begin{<environment>}` and `\end{<environment>}` get enclosed in `$$` tags.

