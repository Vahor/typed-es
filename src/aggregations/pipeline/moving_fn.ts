import type { BucketsPath } from "./types";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-movfn-aggregation
 */
export type MovingFunctionAggs<Agg> = Agg extends {
	moving_fn: {
		buckets_path: BucketsPath;
		window: number;
		script: string;
	};
}
	? {
			value: number | null;
			value_as_string?: string;
		}
	: never;
