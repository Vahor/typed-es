import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";

type HistogramAggOutput<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
> = {
	key: number;
	doc_count: number;
} & AppendSubAggs<BaseQuery, E, Index, Agg>;

export type HistogramAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	histogram: {
		field: string;
		interval: number;
		keyed?: infer Keyed;
	};
}
	? Keyed extends true
		? {
				buckets: Record<
					`${number}`,
					HistogramAggOutput<BaseQuery, E, Index, Agg>
				>;
			}
		: {
				// array default (keyed: false)
				buckets: Array<HistogramAggOutput<BaseQuery, E, Index, Agg>>;
			}
	: never;
