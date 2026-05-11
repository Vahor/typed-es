import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Significant Terms Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_terms_agg: {
					significant_terms: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_terms_agg: {
				doc_count: number;
				bg_count: number;
				buckets: Array<{
					key: string;
					doc_count: number;
					score: number;
					bg_count: number;
				}>;
			};
		}>();
	});

	test("with avg sub aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_terms_agg: {
					significant_terms: {
						field: "entity_id";
					};
					aggs: {
						avg_score: {
							avg: { field: "score" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_terms_agg: {
				doc_count: number;
				bg_count: number;
				buckets: Array<{
					key: string;
					doc_count: number;
					score: number;
					bg_count: number;
					avg_score: {
						value: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});
});
