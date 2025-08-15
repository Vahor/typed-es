import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Extended Stats Aggregations", () => {
	test("with extended_stats on number field", () => {
		type Aggregations = TestAggregationOutput<
			"test_types",
			{
				price_stats: {
					extended_stats: {
						field: "price";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_stats: {
				count: number;
				min: number;
				min_as_string?: string;
				max: number;
				max_as_string?: string;
				avg: number;
				avg_as_string?: string;
				sum: number;
				sum_as_string?: string;
				sum_of_squares: number;
				sum_of_squares_as_string?: string;
				variance: number;
				variance_as_string?: string;
				variance_population: number;
				variance_population_as_string?: string;
				variance_sampling: number;
				variance_sampling_as_string?: string;
				std_deviation: number;
				std_deviation_as_string?: string;
				std_deviation_population: number;
				std_deviation_population_as_string?: string;
				std_deviation_sampling: number;
				std_deviation_sampling_as_string?: string;
				std_deviation_bounds: {
					upper: number;
					upper_as_string?: string;
					lower: number;
					lower_as_string?: string;
					upper_population: number;
					upper_population_as_string?: string;
					lower_population: number;
					lower_population_as_string?: string;
					upper_sampling: number;
					upper_sampling_as_string?: string;
					lower_sampling: number;
					lower_sampling_as_string?: string;
				};
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					extended_stats: {
						field: "invalid_field";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
