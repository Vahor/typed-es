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

type DefaultPrecision = 6;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_0_15 = RangeInclusive<0, 15>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohexgrid-aggregation
 */
export type GeoHexGridAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	geohex_grid: {
		field: infer Field extends string;
		precision?: infer Precision;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<GetPrecision<Precision>, Range_0_15> extends true
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
					Range_0_15
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
