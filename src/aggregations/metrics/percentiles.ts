import type { ElasticsearchIndexes } from "../..";
import type { ToDecimal } from "../../types/helpers";
import type {
	AggregationFieldTypeResult,
	ExtractFieldFromFieldOrScript,
} from "../helpers";

type DefaultPercents = [1, 5, 25, 50, 75, 95, 99];

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
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-aggregation
 */
export type Percentiles<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	percentiles: infer Percentiles extends
		| { field: string; percents?: unknown; keyed?: unknown }
		| { script: unknown; percents?: unknown; keyed?: unknown };
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			Percentiles extends { keyed: false }
				? {
						values: PercentilesValues<
							Percentiles extends { percents: infer Percents extends number[] }
								? Percents
								: DefaultPercents
						>;
					}
				: {
						values: PercentilesValuesToObject<
							PercentilesValues<
								Percentiles extends {
									percents: infer Percents extends number[];
								}
									? Percents
									: DefaultPercents
							>
						>;
					},
			ExtractFieldFromFieldOrScript<Percentiles>
		>
	: never;
