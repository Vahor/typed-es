import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { EsPoint, EsShape } from "../../types/fields";
import type { IsSomeSortOf, Not } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-centroid-aggregation
 */
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
					IsSomeSortOf<TypeOfField<Field, E, Index>, EsPoint | EsShape>
				> extends true
			? InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					EsPoint | EsShape
				>
			: {
					location: {
						x: number;
						y: number;
					};
					count: number;
				}
	: never;
