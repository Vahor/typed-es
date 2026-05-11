import type {
	AggregationFieldResult,
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
	TypeOfField,
} from "../..";
import type { IsStringLiteral, PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-rare-terms-aggregation
 */
export type RareTerms<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { rare_terms: { field: infer Field extends string } }
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				buckets: PrettyArray<
					{
						// TODO: should probably add a helper for this kind of thing
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
