import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Sum Bucket Pipeline Aggregation", () => {
	test("docs example: sum monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				sum_monthly_sales: {
					sum_bucket: { buckets_path: "sales_per_month>sales" };
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
			sum_monthly_sales: { value: number; value_as_string?: string };
		}>();
	});
});
