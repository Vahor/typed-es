import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "..";
import type { IsSomeSortOf, ToDecimal } from "../types/helpers";

type PercentilesValues<Percents extends readonly number[]> = {
	[index in keyof Percents]: {
		key: ToDecimal<Percents[index]>;
		value: number;
	};
};

type PercentilesValuesToObject<Values> = Values extends { key: string }[]
	? {
			[K in Values[number] as K["key"]]: number;
		}
	: never;

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-rank-aggregation
export type PercentileRanksAggs<
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
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, number> extends true
			? Keyed extends false
				? {
						values: PercentilesValues<Values>;
					}
				: {
						values: PercentilesValuesToObject<PercentilesValues<Values>>;
					}
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					number
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
