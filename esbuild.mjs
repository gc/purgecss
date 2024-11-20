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
	entryPoints: ["src/**/*.ts", "src/**/*.js"],
	external: [],
	outExtension: { ".js": ".mjs" },
});
