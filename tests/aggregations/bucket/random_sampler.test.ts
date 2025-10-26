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

	test("random_sampler with valid probability values", () => {
		// Valid: 0.1 (between 0 and 0.5)
		type Agg1 = TestAggregationOutput<
			"orders",
			{
				sample1: {
					random_sampler: {
						probability: 0.1;
					};
				};
			}
		>;
		expectTypeOf<Agg1["aggregations"]["sample1"]>().toEqualTypeOf<{
			doc_count: number;
		}>();

		// Valid: 0.49 (just under 0.5)
		type Agg2 = TestAggregationOutput<
			"orders",
			{
				sample2: {
					random_sampler: {
						probability: 0.49;
					};
				};
			}
		>;
		expectTypeOf<Agg2["aggregations"]["sample2"]>().toEqualTypeOf<{
			doc_count: number;
		}>();

		// Valid: 1 (exactly 1)
		type Agg3 = TestAggregationOutput<
			"orders",
			{
				sample3: {
					random_sampler: {
						probability: 1;
					};
				};
			}
		>;
		expectTypeOf<Agg3["aggregations"]["sample3"]>().toEqualTypeOf<{
			doc_count: number;
		}>();

		// Valid: 0.001 (small positive value)
		type Agg4 = TestAggregationOutput<
			"orders",
			{
				sample4: {
					random_sampler: {
						probability: 0.001;
					};
				};
			}
		>;
		expectTypeOf<Agg4["aggregations"]["sample4"]>().toEqualTypeOf<{
			doc_count: number;
		}>();
	});

	test("random_sampler with invalid probability values", () => {
		// Invalid: 0.5 (must be less than 0.5, not equal)
		type Agg1 = TestAggregationOutput<
			"orders",
			{
				sample1: {
					random_sampler: {
						probability: 0.5;
					};
				};
			}
		>;
		expectTypeOf<Agg1["aggregations"]["sample1"]>().toMatchTypeOf<{
			error: string;
		}>();

		// Invalid: 0.6 (greater than 0.5 and not 1)
		type Agg2 = TestAggregationOutput<
			"orders",
			{
				sample2: {
					random_sampler: {
						probability: 0.6;
					};
				};
			}
		>;
		expectTypeOf<Agg2["aggregations"]["sample2"]>().toMatchTypeOf<{
			error: string;
		}>();

		// Invalid: 2 (greater than 1)
		type Agg3 = TestAggregationOutput<
			"orders",
			{
				sample3: {
					random_sampler: {
						probability: 2;
					};
				};
			}
		>;
		expectTypeOf<Agg3["aggregations"]["sample3"]>().toMatchTypeOf<{
			error: string;
		}>();

		// Invalid: -0.1 (negative)
		type Agg4 = TestAggregationOutput<
			"orders",
			{
				sample4: {
					random_sampler: {
						probability: -0.1;
					};
				};
			}
		>;
		expectTypeOf<Agg4["aggregations"]["sample4"]>().toMatchTypeOf<{
			error: string;
		}>();

		// Invalid: 0 (must be greater than 0)
		type Agg5 = TestAggregationOutput<
			"orders",
			{
				sample5: {
					random_sampler: {
						probability: 0;
					};
				};
			}
		>;
		expectTypeOf<Agg5["aggregations"]["sample5"]>().toMatchTypeOf<{
			error: string;
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
