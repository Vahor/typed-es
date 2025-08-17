import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { Point, Shape } from "../../types/fields";
import type { IsSomeSortOf, Not } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-centroid-aggregation
export type CartesianCentroidAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	cartesian_centroid: {
		field: infer Field extends string;
	};
}
	? Not<CanBeUsedInAggregation<Field, Index, E>> extends true
		? InvalidFieldInAggregation<Field, Index, Agg>
		: Not<
					IsSomeSortOf<TypeOfField<Field, E, Index>, Point | Shape>
				> extends true
			? InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					Point | Shape
				>
			: {
					location: {
						x: number;
						y: number;
					};
					count: number;
				}
	: never;
