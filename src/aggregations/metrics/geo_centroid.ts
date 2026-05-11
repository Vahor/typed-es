import type { ElasticsearchIndexes } from "../..";
import type {
	AggregationFieldResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geocentroid-aggregation
 */
export type GeoCentroid<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_centroid: infer GeoCentroid extends
		| { field: string }
		| { script: unknown };
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
			ExtractFieldFromFieldOrScript<GeoCentroid>
		>
	: never;
