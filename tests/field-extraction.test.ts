import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type {
	ElasticsearchOutput,
	RequestedFields,
	RequestedIndex,
} from "../src/index";
import type { CustomIndexes, testQueries } from "./shared";

describe("Field Extraction", () => {
	describe("Should extract the fields", () => {
		test("with _source", () => {
			expectTypeOf<
				RequestedFields<typeof testQueries.invalidSourceQuery, CustomIndexes>
			>().toEqualTypeOf<"score" | "invalid">();
		});

		test("without _source", () => {
			expectTypeOf<
				RequestedFields<typeof testQueries.queryWithoutSource, CustomIndexes>
			>().toEqualTypeOf<keyof CustomIndexes["demo"]>();
		});

		test("with _source set to false", () => {
			type Query = typeof testQueries.queryWithoutSource & { _source: false };
			expectTypeOf<
				RequestedFields<Query, CustomIndexes>
			>().toEqualTypeOf<never>();
		});
	});

	test("Should extract the index", () => {
		expectTypeOf<
			RequestedIndex<typeof testQueries.invalidIndex>
		>().toEqualTypeOf<"invalid">();
	});

	test("Should fail if the index is not found", () => {
		expectTypeOf<
			ElasticsearchOutput<typeof testQueries.invalidIndex, CustomIndexes>
		>().toEqualTypeOf<"Index 'invalid' not found">;
	});
});
