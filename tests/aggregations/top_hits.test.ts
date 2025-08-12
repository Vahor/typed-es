import { describe, expectTypeOf, test } from "bun:test";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Top Hits Aggregations", () => {
	test("top_hits query construction", () => {
		const query = typedEs(client, {
			index: "orders",
			rest_total_hits_as_int: true,
			_source: false,
			size: 0,
			aggs: {
				top_tags: {
					terms: {
						field: "product_ids",
						size: 3,
					},
					aggs: {
						top_sales_hits: {
							top_hits: {
								sort: [
									{
										created_at: {
											order: "desc",
										},
									},
								],
								_source: {
									includes: ["shipping_address.street"],
								},
								size: 1,
							},
						},
					},
				},
			},
		});

		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];

		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
