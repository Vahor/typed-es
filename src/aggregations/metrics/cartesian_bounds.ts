import type { ElasticsearchIndexes } from "../..";
import type { AggregationFieldResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-bounds-aggregation
 */
export type CartesianBounds<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	cartesian_bounds: {
		field: infer Field extends string;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
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
			},
			Field
		>
	: never;
