#!/usr/bin/env bun

/**
 * Type coverage checker with minimum file count validation.
 *
 * This script ensures that:
 * 1. Type coverage meets the minimum percentage threshold (99%)
 * 2. A minimum number of files are being checked (to prevent accidental exclusion of test files)
 *
 * Without this check, removing the tests/ folder would result in 100% coverage
 * of just the src/ files, which is misleading.
 */

import { $ } from "bun";

const MIN_TOTAL_COUNT = 8000; // Minimum number of type checks (ensures tests are included)
const MIN_COVERAGE_PERCENT = 99;

async function main() {
	console.log("Running type coverage check...\n");

	// Run type-coverage with JSON output
	const result = await $`bunx type-coverage --strict --json-output`.text();

	const data = JSON.parse(result);

	const { correctCount, totalCount, percent, percentString } = data;

	console.log(
		`Type Coverage: ${percentString}% (${correctCount}/${totalCount})`,
	);
	console.log(`Minimum required: ${MIN_COVERAGE_PERCENT}%`);
	console.log(`Minimum file count: ${MIN_TOTAL_COUNT}`);
	console.log();

	// Check coverage percentage
	if (percent < MIN_COVERAGE_PERCENT) {
		console.error(
			`❌ Type coverage ${percentString}% is below minimum ${MIN_COVERAGE_PERCENT}%`,
		);
		process.exit(1);
	}

	// Check minimum file count to ensure tests are included
	if (totalCount < MIN_TOTAL_COUNT) {
		console.error(
			`❌ Total type checks (${totalCount}) is below minimum ${MIN_TOTAL_COUNT}`,
		);
		console.error("   This likely means test files are not being checked.");
		console.error("   Did you accidentally exclude or remove test files?");
		process.exit(1);
	}

	console.log("✅ Type coverage check passed!");
	process.exit(0);
}

main();
