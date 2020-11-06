import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';

const pkg = require("./package.json");

export default {
  input: `src/index.ts`,
  output: [
    {file: 'dist/index.js', format: 'es'},
    {file: 'dist/index.cjs', format: 'cjs'}
  ],
  plugins: [
    typescript({
      include: [
          './src/**/*.ts',
      ],
    }),
    replace({"__JUPYSTAR_VERSION__": pkg.version}),
    resolve(),
    commonjs(),
  ]
};
