import * as esbuild from "esbuild";

await esbuild.build({
	keepNames: true,
	minify: true,
	bundle: true,
	sourcemap: false,
	platform: "node",
	format: "esm",
	target: "esnext",
	metafile: true,
	outdir: "dist",
	entryPoints: ["src/index.ts"],
});
