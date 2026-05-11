/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-sum-aggregation
 */
export type CumulativeSum<Agg> = Agg extends {
	cumulative_sum: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
