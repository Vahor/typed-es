import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Categorize Text Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				categories: {
					categorize_text: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			categories: {
				buckets: Array<{
					key: string;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				text_categories: {
					categorize_text: {
						field: "entity_id";
					};
					aggs: {
						avg_score: {
							avg: {
								field: "score";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			text_categories: {
				buckets: Array<{
					key: string;
					doc_count: number;
					avg_score: {
						value: number | null;
					};
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				categorize_text_agg: {
					categorize_text: {
						field: "invalid_field";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			categorize_text_agg: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["categorize_text_agg"]
			>;
		}>();
	});

	test("fails when using a field that is not a string", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				categorize_text_agg: {
					categorize_text: {
						field: "score";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			categorize_text_agg: InvalidFieldTypeInAggregation<
				"score",
				"demo",
				Aggregations["input"]["categorize_text_agg"],
				number,
				string
			>;
		}>();
	});
});
