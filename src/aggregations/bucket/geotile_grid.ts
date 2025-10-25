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

type DefaultPrecision = 7;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_0_29 = RangeInclusive<0, 29>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation
 */
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
		? IsSomeSortOf<GetPrecision<Precision>, Range_0_29> extends true
			? {
					buckets: PrettyArray<
						{
							key: `${GetPrecision<Precision>}/${number}/${number}`;
							doc_count: number;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				}
			: InvalidPropertyTypeInAggregation<
					"precision",
					Agg,
					Precision,
					Range_0_29
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
