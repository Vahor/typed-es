import type { AggregationFieldResult, ElasticsearchIndexes } from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geobounds-aggregation
 */
export type GeoBounds<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_bounds: {
		field: infer Field extends string;
		wrap_longitude?: boolean;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
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
			},
			Field
		>
	: never;
