export type MinBucketFunction = "min_bucket";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-min-bucket-aggregation
 */
export type MinBucketAggs<Agg> = Agg extends {
	min_bucket: { buckets_path: infer P };
}
	? P extends string
		? {
				value: number;
				value_as_string?: string;
				keys: string[];
			}
		: never
	: never;
