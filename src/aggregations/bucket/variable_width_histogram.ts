import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	SearchRequest,
	TypeOfField,
} from "../..";
import type { AtMostN, IsSomeSortOf, Not, Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-variablewidthhistogram-aggregation
 */
export type VariableWidthHistogramAggs<
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
	? Not<CanBeUsedInAggregation<Field, Index, E>> extends true
		? InvalidFieldInAggregation<Field, Index, Agg>
		: Not<IsSomeSortOf<TypeOfField<Field, E, Index>, number>> extends true
			? InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					number
				>
			: {
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
				}
	: never;
