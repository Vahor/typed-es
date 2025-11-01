/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-extended-stats-bucket-aggregation
 */
export type ExtendedStatsBucketAggs<Agg> = Agg extends {
	extended_stats_bucket: { buckets_path: string };
}
	? {
			count: number;
			min: number;
			max: number;
			avg: number;
			sum: number;
			min_as_string?: string;
			max_as_string?: string;
			avg_as_string?: string;
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
				lower: number;
				upper_population: number;
				lower_population: number;
				upper_sampling: number;
				lower_sampling: number;
			};
			std_deviation_bounds_as_string?: {
				upper: string;
				lower: string;
				upper_population: string;
				lower_population: string;
				upper_sampling: string;
				lower_sampling: string;
			};
		}
	: never;
