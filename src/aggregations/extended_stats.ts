import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "..";

export type ExtendedStatsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	extended_stats: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
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
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
