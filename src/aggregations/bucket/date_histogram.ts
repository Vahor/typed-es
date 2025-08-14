import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-datehistogram-aggregation
export type DateHistogramAggs<
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
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? Keyed extends true
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
				}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
