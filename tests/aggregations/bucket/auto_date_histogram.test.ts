import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Auto Date Histogram Aggregations", () => {
	test("basic auto_date_histogram", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_over_time: {
					auto_date_histogram: {
						field: "date";
						buckets: 10;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_over_time: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
				}>;
				interval: string;
			};
		}>();
	});

	test("with nested aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_over_time: {
					auto_date_histogram: {
						field: "date";
						buckets: 5;
					};
					aggs: {
						total_sales: { sum: { field: "score" } };
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_over_time: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					total_sales: {
						value: number;
						value_as_string?: string;
					};
				}>;
				interval: string;
			};
		}>();
	});
});
