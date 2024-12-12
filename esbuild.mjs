import * as esbuild from "esbuild";

await esbuild.build({
	keepNames: true,
	minify: false,
	bundle: true,
	sourcemap: true,
	platform: "node",
	format: "esm",
	target: "esnext",
	metafile: true,
	outdir: "dist",
	entryPoints: ["src/entry.ts"],
	external: [],
	outExtension: { ".js": ".mjs" },
	treeShaking: true
});
