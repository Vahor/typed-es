/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-min-bucket-aggregation
 */
export type MinBucketAggs<Agg> = Agg extends {
	min_bucket: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
			keys: string[];
		}
	: never;
