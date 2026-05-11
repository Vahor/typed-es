import { defineConfig } from "tsdown";

export default defineConfig({
	target: ["es2020"],
	platform: "node",
	entry: ["./src/index.ts"],
	clean: true,
	unbundle: true,
	sourcemap: false,
	exports: true,
	dts: {
		sourcemap: false,
		cjsReexport: false, // assumes that we use the same outDir for both format.
	},
	format: {
		cjs: {
			outDir: "./dist/cjs",
		},
		esm: {
			outDir: "./dist/esm",
		},
	},
	deps: {
		onlyBundle: [],
	},
});
