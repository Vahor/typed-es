import type {
	AggregationFieldTypeResult,
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significanttext-aggregation
 */
export type SignificantText<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { significant_text: { field: infer Field extends string } }
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			{
				doc_count: number;
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
