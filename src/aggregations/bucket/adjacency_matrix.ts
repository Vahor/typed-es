import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Combinations, Prettify, PrettyArray } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation

type DefaultSeparator = "&";
type GetSeparator<S> = S extends string ? S : DefaultSeparator;

export type AdjacencyMatrixAggs<
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
					{
						key: Combinations<Extract<Keys, string>, GetSeparator<Separator>>;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
		: never
	: never;
