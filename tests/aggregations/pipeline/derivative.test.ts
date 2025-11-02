// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Derivative Pipeline Aggregation", () => {
	test("docs example: derivative of monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						sales: { sum: { field: "price" } };
						sales_deriv: { derivative: { buckets_path: "sales" } };
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
					sales_deriv: {
						value: number;
						normalized_value?: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});

	test("with unit returns normalized_value", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_per_month: {
					date_histogram: { field: "date"; calendar_interval: "month" };
					aggs: {
						sales: { sum: { field: "price" } };
						sales_deriv: { derivative: { buckets_path: "sales"; unit: "day" } };
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
					sales_deriv: {
						value: number;
						normalized_value: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});
});
