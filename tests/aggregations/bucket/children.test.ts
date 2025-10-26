import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Children Aggregations", () => {
	test("children without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				to_children: {
					children: {
						type: "answer";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			to_children: {
				doc_count: number;
			};
		}>();
	});

	test("children with terms sub-aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				to_items: {
					children: {
						type: "item";
					};
					aggs: {
						by_status: {
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
			to_items: {
				doc_count: number;
				by_status: {
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
