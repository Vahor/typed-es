import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Random Sampler Aggregations", () => {
	test("random_sampler without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				my_sample: {
					random_sampler: {
						probability: 0.1;
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

	test("random_sampler with seed parameter", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				my_sample: {
					random_sampler: {
						probability: 0.05;
						seed: 42;
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

	test("random_sampler with terms sub-aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_sample: {
					random_sampler: {
						probability: 0.1;
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

	test("random_sampler with nested aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				sampled_data: {
					random_sampler: {
						probability: 0.01;
						seed: 12345;
					};
					aggs: {
						status_terms: {
							terms: {
								field: "status";
								size: 10;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sampled_data: {
				doc_count: number;
				status_terms: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: "pending" | "completed" | "cancelled";
						doc_count: number;
					}>;
				};
			};
		}>();
	});
});
