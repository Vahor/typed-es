import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Parent Aggregations", () => {
	test("parent without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				to_parent: {
					parent: {
						type: "answer";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			to_parent: {
				doc_count: number;
			};
		}>();
	});

	test("parent with terms sub-aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				to_questions: {
					parent: {
						type: "answer";
					};
					aggs: {
						top_tags: {
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
			to_questions: {
				doc_count: number;
				top_tags: {
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
