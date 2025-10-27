import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

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
		type?: "paired" | "homoscedastic" | "heteroscedastic";
	};
}
	? FieldA extends string
		? FieldB extends string
			? CanBeUsedInAggregation<FieldA, Index, E> extends true
				? CanBeUsedInAggregation<FieldB, Index, E> extends true
					? {
							value: number;
						}
					: InvalidFieldInAggregation<FieldB, Index, Agg>
				: InvalidFieldInAggregation<FieldA, Index, Agg>
			: {
					value: number;
				}
		: FieldB extends string
			? CanBeUsedInAggregation<FieldB, Index, E> extends true
				? {
						value: number;
					}
				: InvalidFieldInAggregation<FieldB, Index, Agg>
			: {
					value: number;
				}
	: never;
