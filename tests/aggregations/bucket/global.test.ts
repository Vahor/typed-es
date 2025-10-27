import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Global Aggregations", () => {
	// Test 1: Basic global aggregation
	test("global without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				all_orders: {
					global: {};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			all_orders: {
				doc_count: number;
			};
		}>();
	});

	// Test 2: Global aggregation with sub-aggregation
	test("global with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				all_orders: {
					global: {};
					aggs: {
						avg_total: {
							avg: { field: "total" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			all_orders: {
				doc_count: number;
				avg_total: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});

	// Test 3: Global aggregation with multiple sub-aggregations
	test("global with multiple sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				all_orders: {
					global: {};
					aggs: {
						avg_total: {
							avg: { field: "total" };
						};
						max_total: {
							max: { field: "total" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			all_orders: {
				doc_count: number;
				avg_total: {
					value: number;
					value_as_string?: string;
				};
				max_total: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});
});
