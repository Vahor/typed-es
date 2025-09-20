import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Sampler Aggregations", () => {
	test("sampler without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				my_sample: {
					sampler: {
						shard_size: 200;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_sample: {
				doc_count: number;
			};
		}>();
	});

	test("sampler with terms sub-aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_sample: {
					sampler: {
						shard_size: 100;
					};
					aggs: {
						significant_products: {
							significant_text: {
								field: "entity_id";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_sample: {
				doc_count: number;
				significant_products: {
					doc_count: number;
					buckets: Array<{
						key: string;
						doc_count: number;
						score: number;
						bg_count: number;
					}>;
				};
			};
		}>();
	});
});
