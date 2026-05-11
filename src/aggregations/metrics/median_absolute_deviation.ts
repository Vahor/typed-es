import type { AggregationFieldTypeResult, ElasticsearchIndexes } from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-median-absolute-deviation-aggregation
 */
export type MedianAbsoluteDeviation<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	median_absolute_deviation: {
		field: infer Field extends string;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			{
				value: number;
				value_as_string?: string;
			},
			Field
		>
	: never;
