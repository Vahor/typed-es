import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Frequent Item Sets Aggregations", () => {
	test("basic frequent_item_sets from documentation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				my_agg: {
					frequent_item_sets: {
						minimum_set_size: 3;
						fields: [
							{ field: "status" },
							{ field: "user_id" },
							{ field: "total" },
						];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_agg: {
				buckets: Array<{
					key: {
						status: "pending" | "completed" | "cancelled";
						user_id: number;
						total: number;
					};
					doc_count: number;
					support: number;
				}>;
			};
		}>();
	});

	test("with two fields", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				item_sets: {
					frequent_item_sets: {
						fields: [{ field: "status" }, { field: "user_id" }];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			item_sets: {
				buckets: Array<{
					key: {
						status: "pending" | "completed" | "cancelled";
						user_id: number;
					};
					doc_count: number;
					support: number;
				}>;
			};
		}>();
	});

	test("with string array field", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				product_sets: {
					frequent_item_sets: {
						fields: [{ field: "product_ids" }, { field: "status" }];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			product_sets: {
				buckets: Array<{
					key: {
						product_ids: string[];
						status: "pending" | "completed" | "cancelled";
					};
					doc_count: number;
					support: number;
				}>;
			};
		}>();
	});
});
