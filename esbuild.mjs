import * as esbuild from "esbuild";

await esbuild.build({
	keepNames: true,
	minify: true,
	bundle: true,
	sourcemap: true,
	platform: "node",
	format: "esm",
	target: "esnext",
	metafile: true,
	outdir: "dist",
	entryPoints: ["src/**/*.ts", "src/**/*.js"],
});
