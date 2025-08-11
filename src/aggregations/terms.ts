import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
	TypeOfField,
} from "..";
import type { IsStringLiteral, PrettyArray } from "../types/helpers";

export type TermsAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { terms: { field: infer Field extends string } }
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
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
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
