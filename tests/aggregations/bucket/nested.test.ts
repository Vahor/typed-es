import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Nested Aggregations", () => {
	test("nested without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				nested_shipping: {
					nested: {
						path: "shipping_address";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			nested_shipping: {
				doc_count: number;
			};
		}>();
	});

	test("nested with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				nested_shipping: {
					nested: {
						path: "shipping_address";
					};
					aggs: {
						by_city: {
							terms: {
								field: "shipping_address.city";
								size: 10;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			nested_shipping: {
				doc_count: number;
				by_city: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: string | number;
						doc_count: number;
					}>;
				};
			};
		}>();
	});

	test("nested with multiple sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				nested_shipping: {
					nested: {
						path: "shipping_address";
					};
					aggs: {
						by_country: {
							terms: {
								field: "shipping_address.country";
								size: 5;
							};
						};
						by_city: {
							terms: {
								field: "shipping_address.city";
								size: 10;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			nested_shipping: {
				doc_count: number;
				by_country: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: string | number;
						doc_count: number;
					}>;
				};
				by_city: {
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: Array<{
						key: string | number;
						doc_count: number;
					}>;
				};
			};
		}>();
	});
});
