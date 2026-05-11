import type {
	AggregationFieldTypeResult,
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
} from "../../";
import type { PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation
 */
export type SignificantTerms<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { significant_terms: { field: infer Field extends string } }
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			{
				doc_count: number;
				bg_count: number;
				buckets: PrettyArray<
					{
						key: string;
						doc_count: number;
						score: number;
						bg_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			},
			Field
		>
	: never;
