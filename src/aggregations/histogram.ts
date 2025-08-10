import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "..";

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
		field: infer Field extends string;
		interval: number;
		keyed?: infer Keyed;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
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
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
