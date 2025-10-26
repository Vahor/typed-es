import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Filter Aggregations", () => {
	test("filter without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				filtered_orders: {
					filter: {
						term: { status: "completed" };
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			filtered_orders: {
				doc_count: number;
			};
		}>();
	});

	test("filter with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				completed_orders: {
					filter: {
						term: { status: "completed" };
					};
					aggs: {
						avg_total: {
							avg: {
								field: "total";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			completed_orders: {
				doc_count: number;
				avg_total: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});

	test("filter with multiple sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				high_scores: {
					filter: {
						range: {
							score: {
								gte: 100;
							};
						};
					};
					aggs: {
						avg_score: {
							avg: {
								field: "score";
							};
						};
						max_score: {
							max: {
								field: "score";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			high_scores: {
				doc_count: number;
				avg_score: {
					value: number;
					value_as_string?: string;
				};
				max_score: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});
});
