import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Sort Pipeline Aggregation", () => {
	test("should work with terms aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				entities: {
					terms: {
						field: "entity_id";
					};
					aggs: {
						avg_score: { avg: { field: "score" } };
						top_entities: {
							bucket_sort: {
								sort: [{ avg_score: "desc" }];
								size: 5;
							};
						};
					};
				};
			}
		>;

		// `bucket_sort` modifies the buckets but doesn't add to the output
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			entities: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
					avg_score: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});

	test("should work with histogram aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				score_histogram: {
					histogram: {
						field: "score";
						interval: 10;
					};
					aggs: {
						limit_buckets: {
							bucket_sort: {
								size: 10;
								from: 5;
							};
						};
					};
				};
			}
		>;

		// `bucket_sort` doesn't appear in output
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			score_histogram: {
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("should work with date_histogram aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_over_time: {
					date_histogram: {
						field: "date";
						calendar_interval: "month";
					};
					aggs: {
						total_sales: { sum: { field: "price" } };
						sort_and_limit: {
							bucket_sort: {
								sort: [{ total_sales: { order: "desc" } }];
								size: 3;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_over_time: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					total_sales: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});

	test("verifies bucket_sort matches existing filters test pattern", () => {
		// This test replicates the pattern from filters.test.ts line 111-141
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				the_filter: {
					filters: {
						keyed: false;
						filters: {
							"t-shirt": { term: { type: "t-shirt" } };
							hat: { term: { type: "hat" } };
						};
					};
					aggs: {
						avg_price: { avg: { field: "score" } };
						sort_by_avg_price: {
							bucket_sort: { sort: { avg_price: "asc" } };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			the_filter: {
				buckets: Array<{
					key: "t-shirt" | "hat";
					doc_count: number;
					avg_price: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
