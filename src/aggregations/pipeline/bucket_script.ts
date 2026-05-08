import type { BucketsPath } from "./types";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-script-aggregation
 */
export type BucketScriptAggs<Agg> = Agg extends {
	bucket_script: {
		buckets_path: BucketsPath;
		script: unknown;
	};
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
