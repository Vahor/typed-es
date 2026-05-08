import type { BucketsPath } from "./types";

export type NormalizeMethod =
	| "rescale_0_1"
	| "rescale_0_100"
	| "percent_of_sum"
	| "mean"
	| "z-score"
	| "softmax";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-normalize-aggregation
 */
export type NormalizeAggs<Agg> = Agg extends {
	normalize: {
		buckets_path: BucketsPath;
		method: NormalizeMethod;
	};
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
