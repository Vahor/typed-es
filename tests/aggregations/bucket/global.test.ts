import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Global Aggregations", () => {
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
});
