import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray } from "../../types/helpers";
import type { AggregationFieldResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-autodatehistogram-aggregation
 */
export type AutoDateHistogram<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	auto_date_histogram: {
		field: infer Field extends string;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				buckets: PrettyArray<
					{
						key_as_string: string;
						key: number;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
				interval: string;
			},
			Field
		>
	: never;
