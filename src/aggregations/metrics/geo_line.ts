import type { ElasticsearchIndexes } from "../..";
import type { AggregationFieldResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geo-line
 */
export type GeoLine<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geo_line: {
		point: {
			field: infer Field extends string;
		};
		// Required only if not in a nested time_series aggregation. So optional for simplicity
		// sort?: {
		// 	field: infer Field extends string;
		// };
		// include_sort?: boolean;
		// size?: number;
		// sort_order?: OrLowercase<"ASC" | "DESC">;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				type: "Feature";
				geometry: {
					type: "LineString";
					coordinates: Array<[lon: number, lat: number]>;
				};
				properties: {
					complete: boolean;
				};
			},
			Field
		>
	: never;
