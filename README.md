# jupystar
Convert Jupyter notebooks (ipynb) to Starboard notebooks.

It won't work for all notebooks - but should at least give sensible output for all notebooks that can be adapted easily.

### Implementation details

nbformat (Jupyter's ipynb format) V3 is supported - when jupystar detects a V3 file it converts it to a V4 format prior to conversion to a Starboard notebook. Some details of this conversion:
* The first worksheet is used, all others are ignored. Also, worksheet metadata is ignored.
* All output is currently dropped in conversion from v3 to v4.
