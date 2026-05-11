import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Combinations, PrettyArray } from "../../types/helpers";
import type { KeyedBucketBase } from "../helpers";

type DefaultSeparator = "&";
type GetSeparator<S> = S extends string ? S : DefaultSeparator;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation
 */
export type AdjacencyMatrix<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	adjacency_matrix: {
		filters: infer Filters;
		separator?: infer Separator;
	};
}
	? Filters extends Record<infer Keys, unknown>
		? {
				buckets: PrettyArray<
					KeyedBucketBase<
						Combinations<Extract<Keys, string>, GetSeparator<Separator>>
					> &
						AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
		: never
	: never;
