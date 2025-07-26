import type { BuildConfig } from "bun";
import dts, { type Options as DtsOptions } from "bun-plugin-dts";

const defaultBuildConfig: BuildConfig = {
	target: "node",
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	packages: "external",
};

const dtsConfig: DtsOptions = {
	output: {
		noBanner: true,
	},
};

await Promise.all([
	Bun.build({
		...defaultBuildConfig,
		plugins: [dts(dtsConfig)],
		format: "esm",
		naming: "[dir]/[name].js",
	}),
	Bun.build({
		...defaultBuildConfig,
		format: "cjs",
		naming: "[dir]/[name].cjs",
	}),
]);
