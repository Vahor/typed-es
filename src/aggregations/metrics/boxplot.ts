import type { ElasticsearchIndexes } from "../..";
import type {
	AggregationFieldTypeResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-boxplot-aggregation
 */
export type Boxplot<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	boxplot: infer Boxplot extends { field: string } | { script: unknown };
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
			ExtractFieldFromFieldOrScript<Boxplot>
		>
	: never;
