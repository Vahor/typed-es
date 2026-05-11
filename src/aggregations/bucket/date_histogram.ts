import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify, PrettyArray } from "../../types/helpers";
import type { AggregationFieldResult, KeyedBucketBase } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-datehistogram-aggregation
 */
export type DateHistogram<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	date_histogram: {
		field: infer Field extends string;
		keyed?: infer Keyed;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			Keyed extends true
				? {
						buckets: Record<
							string,
							Prettify<
								KeyedBucketBase<number> & {
									key_as_string: string;
								} & AppendSubAggs<BaseQuery, E, Index, Agg>
							>
						>;
					}
				: // array default (keyed: false)
					{
						buckets: PrettyArray<
							KeyedBucketBase<number> & {
								key_as_string: string;
							} & AppendSubAggs<BaseQuery, E, Index, Agg>
						>;
					},
			Field
		>
	: never;
