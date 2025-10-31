import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Rare Terms Aggregations", () => {
	test("without other aggs", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				number_agg: {
					rare_terms: {
						field: "user_id";
					};
				};
				string_agg: {
					rare_terms: {
						field: "product_ids";
					};
				};
				string_enum_agg: {
					rare_terms: {
						field: "status";
						max_doc_count: 2;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			number_agg: {
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
			string_agg: {
				buckets: Array<{
					key: string | number;
					doc_count: number;
				}>;
			};
			string_enum_agg: {
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
				rare_terms_agg: {
					rare_terms: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rare_terms_agg: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["rare_terms_agg"]
			>;
		}>();
	});
});
