import type { AggregationFieldTypeResult, ElasticsearchIndexes } from "../..";

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
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			AggregationFieldTypeResult<
				E,
				Index,
				Agg,
				number,
				{
					value: number;
					value_as_string?: string;
				},
				FieldB
			>,
			FieldA
		>
	: never;
