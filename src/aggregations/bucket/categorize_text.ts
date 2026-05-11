import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray } from "../../types/helpers";
import type { AggregationFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-categorize-text-aggregation
 */
export type CategorizeText<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { categorize_text: { field: infer Field extends string } }
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			{
				buckets: PrettyArray<
					{
						key: string;
						doc_count: number;
						max_matching_length: number;
						regex: string;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			},
			Field
		>
	: never;
