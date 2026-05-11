import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Multi Terms Aggregations", () => {
	// Test with product_ids (array type)
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				genres_and_products: {
					multi_terms: {
						terms: [{ field: "status" }, { field: "user_id" }];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			genres_and_products: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: (number | "pending" | "completed" | "cancelled")[];
					key_as_string: `${string}|${string}`;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with a sub-aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				genres_and_products: {
					multi_terms: {
						terms: [{ field: "status" }, { field: "user_id" }];
					};
					aggs: {
						total_quantity: {
							sum: {
								field: "total";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			genres_and_products: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: (number | "pending" | "completed" | "cancelled")[];
					key_as_string: `${string}|${string}`;
					doc_count: number;
					total_quantity: {
						value: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});
});
