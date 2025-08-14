import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

type DefaultPrecision = 7;

type GetPrecision<P> = P extends number ? P : DefaultPrecision;

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation
export type GeoTileGridAggs<
	BaseQuery extends SearchRequest,
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
				buckets: PrettyArray<
					{
						key: `${GetPrecision<Precision>}/${number}/${number}`;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
