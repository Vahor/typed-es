import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Terms Aggregations", () => {
	test("without other aggs", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				number_agg: {
					terms: {
						field: "user_id";
					};
				};
				string_agg: {
					terms: {
						field: "product_ids";
					};
				};
				string_enum_agg: {
					terms: {
						field: "status";
						size: 10;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			number_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
			string_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
				}>;
			};
			string_enum_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: "pending" | "completed" | "cancelled";
					doc_count: number;
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				terms_agg: {
					terms: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			terms_agg: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["terms_agg"]
			>;
		}>();
	});
});
