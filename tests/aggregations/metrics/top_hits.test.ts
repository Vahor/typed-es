import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Top Hits Aggregations", () => {
	test("top_hits query construction", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				top_tags: {
					terms: {
						field: "product_ids";
						size: 3;
					};
					aggs: {
						top_sales_hits: {
							top_hits: {
								sort: [
									{
										created_at: {
											order: "desc";
										};
									},
								];
								_source: {
									includes: ["shipping_address.street"];
								};
								size: 1;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			top_tags: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
					top_sales_hits: {
						hits: {
							total: number;
							max_score: number | null;
							hits: Array<{
								_index: "orders";
								_id: string;
								_source: {
									shipping_address: {
										street: string;
									};
								};
								sort: Array<unknown>;
								_score: number | null;
							}>;
						};
					};
				}>;
			};
		}>();
	});
});
