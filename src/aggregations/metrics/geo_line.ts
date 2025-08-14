import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geo-line
export type GeoLineAggs<
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
		// 	field: string;
		// };
		// include_sort?: boolean;
		// size?: number;
		// sort_order?: OrLowercase<"ASC" | "DESC">;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				type: "Feature";
				geometry: {
					type: "LineString";
					coordinates: Array<[lon: number, lat: number]>;
				};
				properties: {
					complete: boolean;
				};
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
