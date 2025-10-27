import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Significant Terms Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_terms_agg: {
					significant_terms: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_terms_agg: {
				doc_count: number;
				bg_count: number;
				buckets: Array<{
					key: string;
					doc_count: number;
					score: number;
					bg_count: number;
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_terms_agg: {
					significant_terms: {
						field: "invalid_field";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_terms_agg: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["significant_terms_agg"]
			>;
		}>();
	});

	test("fails when using a field that is not a string", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_terms_agg: {
					significant_terms: {
						field: "score";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_terms_agg: InvalidFieldTypeInAggregation<
				"score",
				"demo",
				Aggregations["input"]["significant_terms_agg"],
				number,
				string
			>;
		}>();
	});
});
