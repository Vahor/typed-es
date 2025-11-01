/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-sum-bucket-aggregation
 */
export type SumBucketAggs<Agg> = Agg extends {
	sum_bucket: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
