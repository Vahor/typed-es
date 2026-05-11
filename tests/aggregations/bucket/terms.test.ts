import { describe, expectTypeOf, test } from "bun:test";
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
});
