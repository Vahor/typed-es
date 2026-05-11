import type { ElasticsearchIndexes } from "../..";
import type { EsPoint, EsShape } from "../../types/fields";
import type { AggregationFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-centroid-aggregation
 */
export type CartesianCentroid<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	cartesian_centroid: {
		field: infer Field extends string;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			EsPoint | EsShape,
			{
				location: {
					x: number;
					y: number;
				};
				count: number;
			},
			Field
		>
	: never;
