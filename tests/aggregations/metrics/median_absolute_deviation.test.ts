import { describe, expectTypeOf, test } from "bun:test";
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
				value_as_string?: string;
			};
		}>();
	});
});
