import type { ElasticsearchIndexes } from "../..";
import type {
	AggregationFieldResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-bounds-aggregation
 */
export type CartesianBounds<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	cartesian_bounds: infer CartesianBounds extends
		| { field: string }
		| { script: unknown };
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
			ExtractFieldFromFieldOrScript<CartesianBounds>
		>
	: never;
