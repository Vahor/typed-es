// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Selector Pipeline Aggregation", () => {
	test("docs example: retain months with total_sales > 200", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						total_sales: { sum: { field: "price" } };
						sales_bucket_filter: {
							bucket_selector: {
								buckets_path: { totalSales: "total_sales" };
								script: string;
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
					total_sales: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
