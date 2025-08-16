import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, Not } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-rate-aggregation
export type RateAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	rate: {
		unit: string;
		field?: infer Field extends string;
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
					value: number;
				}
	: never;
