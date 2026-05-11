import type { ElasticsearchIndexes } from "../..";
import type { AggregationTwoFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation
 */
export type WeightedAvg<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	weighted_avg: {
		value: {
			field?: infer ValueField extends string;
			script?: string;
		};
		weight: {
			field?: infer WeightField extends string;
			script?: string;
		};
	};
}
	? AggregationTwoFieldTypeResult<
			E,
			Index,
			Agg,
			ValueField,
			number | Array<number>,
			WeightField,
			number,
			{
				value: number;
				value_as_string?: string;
			}
		>
	: never;
