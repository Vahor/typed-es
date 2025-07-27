import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type {
	ElasticsearchOutput,
	RequestedFields,
	RequestedIndex,
	SearchRequest,
} from "../src/index";
import type { CustomIndexes, testQueries } from "./shared";

describe("Field Extraction", () => {
	describe("Should extract the fields", () => {
		test("with _source", () => {
			const query = {
				index: "demo",
				_source: ["score", "invalid"],
			} as const satisfies SearchRequest;
			expectTypeOf<
				RequestedFields<typeof query, CustomIndexes>
			>().toEqualTypeOf<"score" | "invalid">();
		});

		test("without _source", () => {
			const query = {
				index: "demo",
			} as const satisfies SearchRequest;
			expectTypeOf<
				RequestedFields<typeof query, CustomIndexes>
			>().toEqualTypeOf<keyof CustomIndexes["demo"]>();
		});

		test("with _source set to false", () => {
			const query = {
				index: "demo",
				_source: false,
			} as const satisfies SearchRequest;
			expectTypeOf<
				RequestedFields<typeof query, CustomIndexes>
			>().toEqualTypeOf<never>();
		});

		describe("with _source set to filters", () => {
			test("with _source.includes", () => {
				const query = {
					index: "demo",
					_source: {
						includes: ["score", "invalid"],
					},
				} as const satisfies SearchRequest;
				expectTypeOf<
					RequestedFields<typeof query, CustomIndexes>
				>().toEqualTypeOf<"score" | "invalid">();
			});

			test("with _source.excludes", () => {
				const query = {
					index: "demo",
					_source: {
						excludes: ["score"],
					},
				} as const satisfies SearchRequest;
				expectTypeOf<
					RequestedFields<typeof query, CustomIndexes>
				>().toEqualTypeOf<Exclude<keyof CustomIndexes["demo"], "score">>();
			});
			test("with _source.includes and _source.excludes", () => {
				const query = {
					index: "demo",
					_source: {
						includes: ["score"],
						excludes: ["score"],
					},
				} as const satisfies SearchRequest;
				expectTypeOf<
					RequestedFields<typeof query, CustomIndexes>
				>().toEqualTypeOf<never>();
			});
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
