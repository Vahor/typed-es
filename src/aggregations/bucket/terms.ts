import type {
	AggregationFieldResult,
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
	TypeOfField,
} from "../..";
import type { IsStringLiteral, PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-terms-aggregation
 */
export type Terms<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { terms: { field: infer Field extends string } }
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: PrettyArray<
					{
						key: number extends TypeOfField<Field, E, Index>
							? number
							: IsStringLiteral<TypeOfField<Field, E, Index>> extends true
								? TypeOfField<Field, E, Index>
								: string | number;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			},
			Field
		>
	: never;
