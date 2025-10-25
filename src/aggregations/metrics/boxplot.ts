import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-boxplot-aggregation
 */
export type BoxplotAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	boxplot: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, number> extends true
			? {
					min: number;
					max: number;
					q1: number;
					q2: number;
					q3: number;
					lower: number;
					upper: number;
				}
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					number
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
