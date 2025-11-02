// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Normalize Pipeline Aggregation", () => {
	test("docs example: percent_of_sum over monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						sales: { sum: { field: "price" } };
						percent_of_total_sales: {
							normalize: {
								buckets_path: "sales";
								method: "percent_of_sum";
								format?: string;
							};
						};
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
					percent_of_total_sales: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
