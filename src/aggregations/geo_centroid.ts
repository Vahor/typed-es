import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "..";

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
