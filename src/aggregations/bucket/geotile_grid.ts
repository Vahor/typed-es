import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray, RangeInclusive } from "../../types/helpers";
import type {
	AggregationFieldResult,
	AggregationPropertyTypeResult,
	KeyedBucketBase,
} from "../helpers";

type DefaultPrecision = 7;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_0_29 = RangeInclusive<0, 29>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation
 */
export type GeoTileGrid<
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
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			AggregationPropertyTypeResult<
				"precision",
				Agg,
				Precision,
				Range_0_29,
				{
					buckets: PrettyArray<
						KeyedBucketBase<`${GetPrecision<Precision>}/${number}/${number}`> &
							AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				},
				GetPrecision<Precision>
			>,
			Field
		>
	: never;
