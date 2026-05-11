import type { AggregationFieldTypeResult, ElasticsearchIndexes } from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-rate-aggregation
 */
export type Rate<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	rate: {
		unit: string;
		field?: infer Field extends string;
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
