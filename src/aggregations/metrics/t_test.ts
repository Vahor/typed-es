import type { ElasticsearchIndexes } from "../..";
import type { AggregationTwoFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-ttest-aggregation
 */
export type TTest<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	t_test: {
		a?: { field?: infer FieldA extends string; script?: unknown };
		b?: { field?: infer FieldB extends string; script?: unknown };
	};
}
	? AggregationTwoFieldTypeResult<
			E,
			Index,
			Agg,
			FieldA,
			number,
			FieldB,
			number,
			{
				value: number;
				value_as_string?: string;
			}
		>
	: never;
