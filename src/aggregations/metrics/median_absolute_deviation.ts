import type { ElasticsearchIndexes } from "../..";
import type {
	AggregationFieldTypeResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-median-absolute-deviation-aggregation
 */
export type MedianAbsoluteDeviation<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	median_absolute_deviation: infer MedianAbsoluteDeviation extends
		| { field: string }
		| { script: unknown };
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
			ExtractFieldFromFieldOrScript<MedianAbsoluteDeviation>
		>
	: never;
