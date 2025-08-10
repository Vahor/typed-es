import { describe, expectTypeOf, test } from "bun:test";
import type {
	ElasticsearchOutput,
	RequestedIndex,
	SearchRequest,
} from "../src/index";
import type {
	ExtractQuery_Source,
	ExtractQueryFields,
} from "../src/types/requested-fields";
import type { CustomIndexes, testQueries } from "./shared";

describe("Field Extraction", () => {
	describe("_source", () => {
		test("with _source", () => {
			const query = {
				index: "demo",
				_source: ["score", "invalid"],
			} as const satisfies SearchRequest;
			expectTypeOf<
				ExtractQuery_Source<typeof query, CustomIndexes>
			>().toEqualTypeOf<"score" | "invalid">();
		});

		test("without _source", () => {
			const query = {
				index: "demo",
			} as const satisfies SearchRequest;
			expectTypeOf<
				ExtractQuery_Source<typeof query, CustomIndexes>
			>().toEqualTypeOf<keyof CustomIndexes["demo"]>();
		});

		test("with _source set to false", () => {
			const query = {
				index: "demo",
				_source: false,
			} as const satisfies SearchRequest;
			expectTypeOf<
				ExtractQuery_Source<typeof query, CustomIndexes>
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
					ExtractQuery_Source<typeof query, CustomIndexes>
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
					ExtractQuery_Source<typeof query, CustomIndexes>
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
					ExtractQuery_Source<typeof query, CustomIndexes>
				>().toEqualTypeOf<never>();
			});
		});
	});

	describe("fields", () => {
		test("with fields", () => {
			const query = {
				index: "demo",
				_source: false,
				fields: ["sore", "invalid"],
			} as const satisfies SearchRequest;
			expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<
				"sore" | "invalid"
			>();
		});

		test("with object fields", () => {
			const query = {
				index: "demo",
				_source: false,
				fields: [{ field: "created_at", format: "yyyy-MM-dd" }],
			} as const satisfies SearchRequest;
			expectTypeOf<
				ExtractQueryFields<typeof query>
			>().toEqualTypeOf<"created_at">();
		});
	});

	describe("docvalue_fields", () => {
		test("with docvalue_fields", () => {
			const query = {
				index: "demo",
				_source: false,
				docvalue_fields: ["sore", "invalid"],
			} as const satisfies SearchRequest;
			expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<
				"sore" | "invalid"
			>();
		});

		test("with object fields", () => {
			const query = {
				index: "demo",
				_source: false,
				docvalue_fields: [{ field: "created_at", format: "yyyy-MM-dd" }],
			} as const satisfies SearchRequest;
			expectTypeOf<
				ExtractQueryFields<typeof query>
			>().toEqualTypeOf<"created_at">();
		});
	});

	describe("index", () => {
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
});
