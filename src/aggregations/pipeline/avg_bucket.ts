/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-avg-bucket-aggregation
 */
export type AvgBucketAggs<Agg> = Agg extends {
	avg_bucket: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
