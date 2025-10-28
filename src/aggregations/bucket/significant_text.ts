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
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significanttext-aggregation
 */
export type SignificantTextAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { significant_text: { field: infer Field extends string } }
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, string> extends true
			? {
					doc_count: number;
					buckets: PrettyArray<
						{
							key: string;
							doc_count: number;
							score: number;
							bg_count: number;
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
