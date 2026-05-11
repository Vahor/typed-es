import type { BucketsPath } from "./types";

/**
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-aggregations-pipeline-movavg-aggregation.html
 */
export type MovingAverage<Agg> = Agg extends {
	moving_avg: { buckets_path: BucketsPath };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
