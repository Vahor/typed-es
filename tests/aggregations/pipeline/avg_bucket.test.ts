import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Avg Bucket Pipeline Aggregation", () => {
	test("docs example: avg monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				avg_monthly_sales: {
					avg_bucket: {
						buckets_path: "sales_per_month>sales";
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
				}>;
			};
			avg_monthly_sales: { value: number; value_as_string?: string };
		}>();
	});
});
