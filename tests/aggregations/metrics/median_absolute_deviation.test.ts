import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Median Absolute Deviation Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				review_average: {
					avg: {
						field: "rating";
					};
				};
				review_variability: {
					median_absolute_deviation: {
						field: "rating";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: {
				value: number;
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				review_average: {
					avg: {
						field: "rating";
					};
				};
				review_variability: {
					median_absolute_deviation: {
						field: "id";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: InvalidFieldTypeInAggregation<
				"id",
				"reviews",
				Aggregations["input"]["review_variability"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				review_average: {
					avg: {
						field: "rating";
					};
				};
				review_variability: {
					median_absolute_deviation: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: InvalidFieldInAggregation<
				"invalid",
				"reviews",
				Aggregations["input"]["review_variability"]
			>;
		}>();
	});
});
