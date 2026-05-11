import type { ElasticsearchIndexes } from "../..";
import type { Prettify } from "../../types/helpers";
import type { AggregationFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-string-stats-aggregation
 */
export type StringStats<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	string_stats: {
		field: infer Field extends string;
		show_distribution?: infer ShowDistribution;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			Prettify<
				{
					count: number;
					min_length: number;
					max_length: number;
					avg_length: number;
					entropy: number;
				} & {
					[K in "distribution" as ShowDistribution extends true
						? K
						: never]: Record<string, number>;
				}
			>,
			Field
		>
	: never;
