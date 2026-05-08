import type { Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-correlation-aggregation
 */
export type BucketCorrelationAggs<Agg> = Agg extends {
	bucket_correlation: {
		buckets_path: string;
		function: {
			count_correlation: {
				indicator: {
					doc_count: number;
					expectations: readonly number[];
					fractions?: readonly number[];
				};
			};
		};
	};
}
	? Prettify<{
			value: number;
		}>
	: never;
