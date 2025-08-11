import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Extended Stats Aggregations", () => {
	test("with extended_stats on number field", () => {
		const query = typedEs(client, {
			index: "test_types",
			size: 0,
			_source: false,
			aggs: {
				price_stats: {
					extended_stats: {
						field: "price",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				invalid_stats: {
					extended_stats: {
						field: "invalid_field",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				(typeof query)["aggs"]["invalid_stats"]
			>;
		}>();
	});
});
