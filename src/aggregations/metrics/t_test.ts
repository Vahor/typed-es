import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-ttest-aggregation
 */
export type TTestAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	t_test: {
		a?: { field?: infer FieldA extends string; script?: unknown };
		b?: { field?: infer FieldB extends string; script?: unknown };
	};
}
	? CanBeUsedInAggregation<FieldA, Index, E> extends true
		? IsSomeSortOf<TypeOfField<FieldA, E, Index>, number> extends true
			? CanBeUsedInAggregation<FieldB, Index, E> extends true
				? IsSomeSortOf<TypeOfField<FieldB, E, Index>, number> extends true
					? {
							value: number;
						}
					: InvalidFieldTypeInAggregation<
							FieldB,
							Index,
							Agg,
							TypeOfField<FieldB, E, Index>,
							number
						>
				: InvalidFieldInAggregation<FieldB, Index, Agg>
			: InvalidFieldTypeInAggregation<
					FieldA,
					Index,
					Agg,
					TypeOfField<FieldA, E, Index>,
					number
				>
		: InvalidFieldInAggregation<FieldA, Index, Agg>
	: never;
