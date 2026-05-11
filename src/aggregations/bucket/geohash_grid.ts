import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray, RangeInclusive } from "../../types/helpers";
import type {
	AggregationFieldResult,
	AggregationPropertyTypeResult,
	KeyedBucketBase,
} from "../helpers";

type DefaultPrecision = 5;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_1_12 = RangeInclusive<1, 12>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohashgrid-aggregation
 */
export type GeoHashGrid<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geohash_grid: {
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
				Range_1_12,
				{
					buckets: PrettyArray<
						KeyedBucketBase<string> & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				},
				GetPrecision<Precision>
			>,
			Field
		>
	: never;
