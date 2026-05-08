/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-script-aggregation
 */
export type BucketScriptAggs<Agg> = Agg extends {
	bucket_script: {
		buckets_path: string | string[] | Record<string, string>;
		script: unknown;
	};
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
