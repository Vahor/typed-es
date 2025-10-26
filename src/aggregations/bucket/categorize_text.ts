import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	SearchRequest,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-categorize-text-aggregation
 */
export type CategorizeTextAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { categorize_text: { field: infer Field extends string } }
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, string> extends true
			? {
					buckets: PrettyArray<
						{
							key: string;
							doc_count: number;
							max_matching_length: number;
							regex: string;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				}
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					string
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
