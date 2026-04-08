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
