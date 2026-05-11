import type { Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-correlation-aggregation
 */
export type BucketCorrelation<Agg> = Agg extends {
	bucket_correlation: unknown;
}
	? Prettify<{
			value: number;
			value_as_string?: string;
		}>
	: never;
