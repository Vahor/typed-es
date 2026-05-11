import type { ElasticsearchIndexes } from "../..";
import type { ToDecimal } from "../../types/helpers";
import type {
	AggregationFieldTypeResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

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
	percentile_ranks: infer PercentileRanks extends
		| { field: string; values: number[]; keyed?: unknown }
		| { script: unknown; values: number[]; keyed?: unknown };
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			PercentileRanks extends { keyed: false }
				? {
						values: PercentilesValues<PercentileRanks["values"]>;
					}
				: {
						values: PercentilesValuesToObject<
							PercentilesValues<PercentileRanks["values"]>
						>;
					},
			ExtractFieldFromFieldOrScript<PercentileRanks>
		>
	: never;
