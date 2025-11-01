export type MaxBucketFunction = "max_bucket";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-max-bucket-aggregation
 */
export type MaxBucketAggs<Agg> = Agg extends {
	max_bucket: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
			keys: string[];
		}
	: never;
