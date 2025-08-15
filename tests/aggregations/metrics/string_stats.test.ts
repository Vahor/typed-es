import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("String Stats Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				rating_stats: {
					string_stats: { field: "rating.string" };
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rating_stats: {
				count: number;
				min_length: number;
				max_length: number;
				avg_length: number;
				entropy: number;
			};
		}>();
	});

	test("with show_distribution", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				rating_stats: {
					string_stats: { field: "rating.string"; show_distribution: true };
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rating_stats: {
				count: number;
				min_length: number;
				max_length: number;
				avg_length: number;
				entropy: number;
				distribution: Record<string, number>;
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				rating_stats: { string_stats: { field: "rating" } };
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			rating_stats: InvalidFieldTypeInAggregation<
				"rating",
				"reviews",
				Aggregations["input"]["rating_stats"],
				number,
				string
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				invalid_stats: {
					string_stats: { field: "invalid" };
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid",
				"reviews",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
