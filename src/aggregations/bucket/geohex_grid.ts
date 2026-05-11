import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray, RangeInclusive } from "../../types/helpers";
import type {
	AggregationFieldResult,
	AggregationPropertyTypeResult,
} from "../helpers";

type DefaultPrecision = 6;
type GetPrecision<P> = P extends number ? P : DefaultPrecision;
type Range_0_15 = RangeInclusive<0, 15>;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohexgrid-aggregation
 */
export type GeoHexGrid<
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
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			AggregationPropertyTypeResult<
				"precision",
				Agg,
				Precision,
				Range_0_15,
				{
					buckets: PrettyArray<
						{
							key: string;
							doc_count: number;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				},
				GetPrecision<Precision>
			>,
			Field
		>
	: never;
