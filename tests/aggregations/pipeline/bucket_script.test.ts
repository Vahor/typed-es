// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Script Pipeline Aggregation", () => {
	test("docs example: t-shirt percentage per month", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						total_sales: { sum: { field: "price" } };
						"t-shirts": {
							filter: { term: { type: "t-shirt" } };
							aggs: { sales: { sum: { field: "price" } } };
						};
						"t-shirt-percentage": {
							bucket_script: {
								buckets_path: {
									tShirtSales: "t-shirts>sales";
									totalSales: "total_sales";
								};
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
					"t-shirts": {
						doc_count: number;
						sales: { value: number; value_as_string?: string };
					};
					"t-shirt-percentage": { value: number };
				}>;
			};
		}>();
	});
});
