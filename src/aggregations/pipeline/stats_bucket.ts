/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-stats-bucket-aggregation
 */
export type StatsBucketAggs<Agg> = Agg extends {
	stats_bucket: { buckets_path: string };
}
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
		}
	: never;
