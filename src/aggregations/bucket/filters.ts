import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify, PrettyArray } from "../../types/helpers";
import type { BucketBase, KeyedBucketBase } from "../helpers";

type KeysAndOBK<Keys, Agg> = Agg extends {
	filters: { other_bucket_key: infer OBK extends string };
}
	? OBK | Keys
	: Keys;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation
 */
export type Filters<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	filters: {
		keyed?: infer Keyed;
		filters: infer Filters;
	};
}
	? Filters extends Array<unknown>
		? // Anonymous filters (array format)
			{
				buckets: PrettyArray<
					BucketBase & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
		: Filters extends Record<infer Keys, unknown>
			? // Named filters (object format)
				Keyed extends false
				? {
						buckets: PrettyArray<
							KeyedBucketBase<KeysAndOBK<Keys, Agg>> &
								AppendSubAggs<BaseQuery, E, Index, Agg>
						>;
					}
				: {
						buckets: Prettify<{
							[K in KeysAndOBK<Keys, Agg>]: BucketBase &
								AppendSubAggs<BaseQuery, E, Index, Agg>;
						}>;
					}
			: never
	: never;
