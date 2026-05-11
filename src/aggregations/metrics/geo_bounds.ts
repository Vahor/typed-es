import type { ElasticsearchIndexes } from "../..";
import type {
	AggregationFieldResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geobounds-aggregation
 */
export type GeoBounds<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_bounds: infer GeoBounds extends
		| { field: string; wrap_longitude?: boolean }
		| { script: unknown; wrap_longitude?: boolean };
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
			ExtractFieldFromFieldOrScript<GeoBounds>
		>
	: never;
