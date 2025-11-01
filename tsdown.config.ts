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
	format: ["cjs", "esm"],
	outExtensions: (ctx) => ({
		dts: ctx.format === "cjs" ? ".d.cts" : ".d.mts",
		js: ctx.format === "cjs" ? ".cjs" : ".mjs",
	}),
});
