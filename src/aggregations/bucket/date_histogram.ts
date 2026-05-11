import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray } from "../../types/helpers";
import type { AggregationFieldResult } from "../helpers";

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
							{
								key_as_string: string;
								key: number;
								doc_count: number;
							} & AppendSubAggs<BaseQuery, E, Index, Agg>
						>;
					}
				: // array default (keyed: false)
					{
						buckets: PrettyArray<
							{
								key_as_string: string;
								key: number;
								doc_count: number;
							} & AppendSubAggs<BaseQuery, E, Index, Agg>
						>;
					},
			Field
		>
	: never;
