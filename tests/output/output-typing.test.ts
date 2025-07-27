import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { ElasticsearchOutput } from "../../src/index";
import type { CustomIndexes, testQueries } from "../shared";

describe("ElasticsearchOutput Type", () => {
	test("Should fail if the field is not found", () => {
		expectTypeOf<
			ElasticsearchOutput<
				typeof testQueries.invalidSourceQuery,
				CustomIndexes
			>["hits"]["hits"][0]["_source"]["invalid"]
		>().toBeString();
	});

	describe("Should return the correct type", () => {
		test("with _source", () => {
			expectTypeOf<
				ElasticsearchOutput<
					typeof testQueries.invalidSourceQuery,
					CustomIndexes
				>["hits"]["hits"][0]["_source"]["score"]
			>().toEqualTypeOf<number>();
		});

		test("without _source", () => {
			expectTypeOf<
				ElasticsearchOutput<
					typeof testQueries.queryWithoutSource,
					CustomIndexes
				>["hits"]["hits"][0]["_source"]
			>().toEqualTypeOf<CustomIndexes["demo"]>();
		});

		test("with _source set to false", () => {
			type Query = typeof testQueries.queryWithoutSource & { _source: false };
			expectTypeOf<
				ElasticsearchOutput<Query, CustomIndexes>["hits"]["hits"][0]["_source"]
			>().toEqualTypeOf<never>();
		});
	});
});
