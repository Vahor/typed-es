import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Min Bucket Pipeline Aggregation", () => {
	test("docs example: min monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				min_monthly_sales: {
					min_bucket: { buckets_path: "sales_per_month>sales" };
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
			min_monthly_sales: {
				value: number;
				value_as_string?: string;
				keys: string[];
			};
		}>();
	});
});
