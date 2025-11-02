// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Cumulative Sum Pipeline Aggregation", () => {
	test("docs example: cumulative monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						sales: { sum: { field: "price" } };
						cumulative_sales: { cumulative_sum: { buckets_path: "sales" } };
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_per_month: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					sales: { value: number; value_as_string?: string };
					cumulative_sales: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
