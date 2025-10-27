import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Diversified Sampler Aggregations", () => {
	test("diversified_sampler without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_sample: {
					diversified_sampler: {
						shard_size: 200;
						field: "entity_id";
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

	test("diversified_sampler with terms sub-aggregation (documentation example)", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_sample: {
					diversified_sampler: {
						shard_size: 200;
						field: "entity_id";
					};
					aggs: {
						keywords: {
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
				keywords: {
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

	test("diversified_sampler with max_docs_per_value", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_sample: {
					diversified_sampler: {
						shard_size: 200;
						field: "entity_id";
						max_docs_per_value: 3;
					};
					aggs: {
						keywords: {
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
				keywords: {
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
