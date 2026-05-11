import type { AggregationFieldTypeResult, ElasticsearchIndexes } from "../..";
import type { ToDecimal } from "../../types/helpers";

type PercentilesValues<Percents extends readonly number[]> = {
	[index in keyof Percents]: {
		key: ToDecimal<Percents[index]>;
		value: number;
		value_as_string?: string;
	};
};

type PercentilesValuesToObject<Values> = Values extends { key: string }[]
	? {
			[K in Values[number] as K["key"]]: number;
		}
	: never;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-rank-aggregation
 */
export type PercentileRanks<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	percentile_ranks: {
		field: infer Field extends string;
		values: infer Values extends number[];
		keyed?: infer Keyed;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			Keyed extends false
				? {
						values: PercentilesValues<Values>;
					}
				: {
						values: PercentilesValuesToObject<PercentilesValues<Values>>;
					},
			Field
		>
	: never;
