# jupystar
Convert Jupyter notebooks (ipynb) to Starboard notebooks




### Implementation details

* In conversion from nbformat v3 to v4 the first worksheet is used, all others are ignored. Also, worksheet metadata is ignored.
* All output is currently omitted in conversion from v3 to v4.
