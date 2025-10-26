import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidPropertyTypeInAggregation,
	SearchRequest,
} from "../..";
import type {
	IsSomeSortOf,
	PrettyArray,
	RangeInclusive,
} from "../../types/helpers";

type DefaultPrecision = 5;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_1_12 = RangeInclusive<1, 12>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohashgrid-aggregation
 */
export type GeoHashGridAggs<
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
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<GetPrecision<Precision>, Range_1_12> extends true
			? {
					buckets: PrettyArray<
						{
							key: string;
							doc_count: number;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				}
			: InvalidPropertyTypeInAggregation<
					"precision",
					Agg,
					Precision,
					Range_1_12
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
