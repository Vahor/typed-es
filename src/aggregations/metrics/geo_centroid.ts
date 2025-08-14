import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geocentroid-aggregation
export type GeoCentroidAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_centroid: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				location: {
					lat: number;
					lon: number;
				};
				count: number;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
