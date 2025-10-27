import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-bounds-aggregation
 */
export type CartesianBoundsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	cartesian_bounds: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				bounds: {
					top_left: {
						x: number;
						y: number;
					};
					bottom_right: {
						x: number;
						y: number;
					};
				};
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
