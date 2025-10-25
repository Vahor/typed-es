import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geobounds-aggregation
 */
export type GeoBoundsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_bounds: {
		field: infer Field extends string;
		wrap_longitude?: boolean;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				bounds: {
					top_left: {
						lat: number;
						lon: number;
					};
					bottom_right: {
						lat: number;
						lon: number;
					};
				};
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
