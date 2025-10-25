import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-autodatehistogram-aggregation
export type AutoDateHistogramAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	auto_date_histogram: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				buckets: PrettyArray<
					{
						key_as_string: string;
						key: number;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
				interval: string;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
