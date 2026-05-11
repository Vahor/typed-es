import type { AggregationFieldTypeResult, ElasticsearchIndexes } from "../..";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-boxplot-aggregation
 */
export type Boxplot<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	boxplot: {
		field: infer Field extends string;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			{
				min: number;
				max: number;
				q1: number;
				q2: number;
				q3: number;
				lower: number;
				upper: number;
			},
			Field
		>
	: never;
