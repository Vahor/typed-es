import type { ElasticsearchIndexes } from "../..";
import type { Prettify } from "../../types/helpers";
import type {
	AggregationFieldTypeResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-string-stats-aggregation
 */
export type StringStats<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	string_stats: infer StringStats extends
		| { field: string; show_distribution?: unknown }
		| { script: unknown; show_distribution?: unknown };
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
					[K in "distribution" as StringStats extends {
						show_distribution: true;
					}
						? K
						: never]: Record<string, number>;
				}
			>,
			ExtractFieldFromFieldOrScript<StringStats>
		>
	: never;
