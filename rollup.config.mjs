import cleanup from 'rollup-plugin-cleanup';
import { minify } from 'rollup-plugin-esbuild-minify';
import { rollup } from 'rollup';

/** @type {import('rollup').RollupOptions} */
const inputOptions = {
	input: 'dist/entry.mjs',
  plugins: [cleanup({ comments: "none", extensions: ["js", "ts", "mjs"] }), minify()],
  output: [{ dir: "rollup", format: "esm", sourcemap: false }],
  treeshake: {
    moduleSideEffects: false,
    preset: 'smallest',
  },
};

build();

async function build() {
  const bundle = await rollup(inputOptions);

  await bundle.write({
    dir: "rollup",
    format: "esm",
    sourcemap: false,
  });

  if (bundle) {
    await bundle.close();
  }
}