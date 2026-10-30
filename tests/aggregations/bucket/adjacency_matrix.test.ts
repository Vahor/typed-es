import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("adjacency_matrix aggregation", () => {
	test("basic adjacency_matrix aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				interactions: {
					adjacency_matrix: {
						filters: {
							grpA: { terms: { entity_id: ["hillary", "sidney"] } };
							grpB: { terms: { entity_id: ["donald", "mitt"] } };
							grpC: { terms: { entity_id: ["vladimir", "nigel"] } };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]["interactions"]>().toEqualTypeOf<{
			buckets: Array<{
				key:
					| "grpA"
					| "grpB"
					| "grpC"
					| "grpA&grpB"
					| "grpA&grpC"
					| "grpB&grpC"
					| "grpA&grpB&grpC";
				doc_count: number;
			}>;
		}>();
	});

	test("adjacency_matrix with nested aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				interactions: {
					adjacency_matrix: {
						filters: {
							SomeName: { terms: { entity_id: ["donald"] } };
							AnotherName: { terms: { entity_id: ["hillary"] } };
						};
					};
					aggs: {
						avg_score: {
							avg: { field: "score" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]["interactions"]>().toEqualTypeOf<{
			buckets: Array<{
				key: "SomeName" | "AnotherName" | "AnotherName&SomeName";
				doc_count: number;
				avg_score: {
					value: number;
					value_as_string?: string;
				};
			}>;
		}>();
	});

	test("with custom separator", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				matrix: {
					adjacency_matrix: {
						separator: "|";
						filters: {
							a: { terms: { entity_id: ["a"] } };
							b: { terms: { entity_id: ["b"] } };
							c: { terms: { entity_id: ["c"] } };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]["matrix"]>().toEqualTypeOf<{
			buckets: Array<{
				key: "a" | "b" | "c" | "a|b" | "a|c" | "b|c" | "a|b|c";
				doc_count: number;
			}>;
		}>();
	});
});
