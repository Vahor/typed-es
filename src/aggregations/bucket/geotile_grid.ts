import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "../..";

type DefaultPrecision = 7;

type GetPrecision<P> = P extends number ? P : DefaultPrecision;

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation
export type GeoTileGridAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geotile_grid: {
		field: infer Field extends string;
		precision?: infer Precision;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				buckets: Array<{
					key: `${GetPrecision<Precision>}/${number}/${number}`;
					doc_count: number;
				}>;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
