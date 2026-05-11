import type { AggregationFieldResult, ElasticsearchIndexes } from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geocentroid-aggregation
 */
export type GeoCentroid<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_centroid: {
		field: infer Field extends string;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				location: {
					lat: number;
					lon: number;
				};
				count: number;
			},
			Field
		>
	: never;
