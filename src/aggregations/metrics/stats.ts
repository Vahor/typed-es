import type { ElasticsearchIndexes } from "../..";
import type { AggregationFieldResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-stats-aggregation
 */
export type Stats<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	stats: {
		field: infer Field extends string;
	};
}
	? AggregationFieldResult<
			E,
			Index,
			Agg,
			{
				count: number;
				min: number;
				min_as_string?: string;
				max: number;
				max_as_string?: string;
				avg: number;
				avg_as_string?: string;
				sum: number;
				sum_as_string?: string;
			},
			Field
		>
	: never;
