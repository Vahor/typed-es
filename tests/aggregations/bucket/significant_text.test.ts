import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Significant Text Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_products: {
					significant_text: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_products: {
				doc_count: number;
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
				significant_text_agg: {
					significant_text: {
						field: "invalid_field";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_text_agg: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["significant_text_agg"]
			>;
		}>();
	});

	test("failed when using a field that is not a string", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_text_agg: {
					significant_text: {
						field: "score";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_text_agg: InvalidFieldTypeInAggregation<
				"score",
				"demo",
				Aggregations["input"]["significant_text_agg"],
				number,
				string
			>;
		}>();
	});
});
