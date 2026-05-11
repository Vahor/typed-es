import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

type PackageJson = {
	typeCoverage?: {
		atLeast?: number;
		ignoredSourceFiles?: string[];
	};
};

type CoverageResult = {
	sourceFile: string;
	testFiles: string[];
	typeAssertionCount: number;
};

const typeAssertionPattern = /\bexpectTypeOf\s*(?:<|\()/gu;
const packageJson = JSON.parse(
	readFileSync("package.json", "utf8"),
) as PackageJson;
const atLeast = packageJson.typeCoverage?.atLeast ?? 100;
const ignoredSourceFiles = new Set(
	packageJson.typeCoverage?.ignoredSourceFiles ?? [],
);

function walk(directory: string): string[] {
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);
		const stats = statSync(path);

		return stats.isDirectory() ? walk(path) : [toPosixPath(path)];
	});
}

function toPosixPath(path: string): string {
	return path.replaceAll("\\", "/");
}

function normalizedStem(path: string): string {
	return basename(path)
		.replace(/\.test\.ts$|\.ts$/u, "")
		.replaceAll("_", "-");
}

function countTypeAssertions(path: string): number {
	return readFileSync(path, "utf8").match(typeAssertionPattern)?.length ?? 0;
}

const testFiles = walk("tests").filter((path) => path.endsWith(".test.ts"));
const testsByStem = Map.groupBy(testFiles, normalizedStem);

const results: CoverageResult[] = walk("src")
	.filter((path) => path.endsWith(".ts"))
	.filter((path) => !ignoredSourceFiles.has(path))
	.map((sourceFile) => {
		const matchingTestFiles = testsByStem.get(normalizedStem(sourceFile)) ?? [];

		return {
			sourceFile,
			testFiles: matchingTestFiles,
			typeAssertionCount: matchingTestFiles.reduce(
				(count, testFile) => count + countTypeAssertions(testFile),
				0,
			),
		};
	});

const coveredResults = results.filter(
	(result) => result.typeAssertionCount > 0,
);
const uncoveredResults = results.filter(
	(result) => result.typeAssertionCount === 0,
);
const percentage =
	results.length === 0 ? 100 : (coveredResults.length / results.length) * 100;

console.log(
	`Type test coverage: ${coveredResults.length}/${results.length} (${percentage.toFixed(2)}%)`,
);

if (uncoveredResults.length > 0) {
	console.log("\nMissing type assertions:");
	for (const result of uncoveredResults) {
		const testFiles =
			result.testFiles.length === 0
				? "no matching test file"
				: result.testFiles.join(", ");
		console.log(`- ${result.sourceFile} (${testFiles})`);
	}
}

if (percentage < atLeast) {
	console.error(
		`\nType test coverage ${percentage.toFixed(2)}% is below the required ${atLeast}%.`,
	);
	process.exit(1);
}
