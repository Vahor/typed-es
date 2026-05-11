import type {
	AggregationFieldTypeResult,
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
} from "../..";
import type { AtMostN, Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-variablewidthhistogram-aggregation
 */
export type VariableWidthHistogram<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	variable_width_histogram: {
		field: infer Field extends string;
		buckets: infer Buckets extends number;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			{
				buckets: AtMostN<
					Prettify<
						{
							min: number;
							key: number;
							max: number;
							doc_count: number;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>,
					Buckets
				>;
			},
			Field
		>
	: never;
