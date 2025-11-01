import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Percentiles Bucket Pipeline Aggregation", () => {
	test("docs example: percentiles monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				percentiles_monthly_sales: {
					percentiles_bucket: {
						buckets_path: "sales_per_month>sales";
						percents: [25.0, 50.0, 75.0];
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
			percentiles_monthly_sales: {
				values: {
					"25.0": number;
					"50.0": number;
					"75.0": number;
				};
			};
		}>();
	});

	test("with default percents", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: { sales: { sum: { field: "price" } } };
				};
				percentiles_monthly_sales: {
					percentiles_bucket: {
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
			percentiles_monthly_sales: {
				values: {
					"1.0": number;
					"5.0": number;
					"25.0": number;
					"50.0": number;
					"75.0": number;
					"95.0": number;
					"99.0": number;
				};
			};
		}>;
	});
});
