import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { AggregationFieldResult } from "../helpers";

type HistogramAggOutput<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
> = {
	key: number;
	doc_count: number;
} & AppendSubAggs<BaseQuery, E, Index, Agg>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-histogram-aggregation
 */
export type Histogram<
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
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			Keyed extends true
				? {
						buckets: Record<
							`${number}`,
							HistogramAggOutput<BaseQuery, E, Index, Agg>
						>;
					}
				: {
						// array default (keyed: false)
						buckets: Array<HistogramAggOutput<BaseQuery, E, Index, Agg>>;
					},
			Field
		>
	: never;
