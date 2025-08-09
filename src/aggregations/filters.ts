import type {
	AggregationOutput,
	ElasticsearchIndexes,
	NextAggsParentKey,
	SearchRequest,
} from "..";
import type { Prettify, PrettyArray } from "../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation

type KeysAndOBK<Keys, Agg> = Agg extends {
	filters: { other_bucket_key: infer OBK extends string };
}
	? OBK | Keys
	: Keys;

export type FiltersAggs<
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
					{
						doc_count: number;
					} & {
						[k in NextAggsParentKey<Agg>]: AggregationOutput<
							BaseQuery,
							Agg,
							E,
							k,
							Index
						>;
					}
				>;
			}
		: Filters extends Record<infer Keys, unknown>
			? // Named filters (object format)
				Keyed extends false
				? {
						buckets: PrettyArray<
							{
								key: KeysAndOBK<Keys, Agg>;
								doc_count: number;
							} & {
								[k in NextAggsParentKey<Agg>]: AggregationOutput<
									BaseQuery,
									Agg,
									E,
									k,
									Index
								>;
							}
						>;
					}
				: {
						buckets: Prettify<{
							[K in KeysAndOBK<Keys, Agg>]: {
								doc_count: number;
							} & {
								[k in NextAggsParentKey<Agg>]: AggregationOutput<
									BaseQuery,
									Agg,
									E,
									k,
									Index
								>;
							};
						}>;
					}
			: never
	: never;
