import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Reverse Nested Aggregations", () => {
	test("reverse_nested without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				rev: {
					reverse_nested: {
						path: "shipping_address";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rev: {
				doc_count: number;
			};
		}>();
	});

	test("reverse_nested with multiple sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				rev: {
					reverse_nested: {
						path: "shipping_address";
					};
					aggs: {
						by_country: {
							terms: {
								field: "shipping_address.country";
								size: 5;
							};
						};
						by_status: {
							terms: {
								field: "status";
								size: 10;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rev: {
				doc_count: number;
				by_country: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: string | number;
						doc_count: number;
					}>;
				};
				by_status: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: "pending" | "completed" | "cancelled";
						doc_count: number;
					}>;
				};
			};
		}>();
	});

	test("reverse_nested with default path", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				rev: {
					reverse_nested: {};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rev: {
				doc_count: number;
			};
		}>();
	});
});
