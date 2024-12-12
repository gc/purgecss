import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';

const name = 'index';
const input = 'dist/entry.mjs';

export default [
  {
    input,
    external: id => !/^[./]/.test(id),
    plugins: [
      cleanup({ comments: 'none', extensions: ['js', 'ts', 'mjs'] }),
    ],
    output: [
      { dir: `rollup`, format: 'esm', sourcemap: false },
    ],
  },
  {
    input,
    external: id => !/^[./]/.test(id),
    plugins: [dts()],
    output: {
      file: `rollup/${name}.d.ts`,
      format: 'es',
    },
  },
];
