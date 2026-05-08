import type { BucketsPath } from "./types";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-serialdiff-aggregation
 */
export type SerialDiffAggs<Agg> = Agg extends {
	serial_diff: { buckets_path: BucketsPath };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
