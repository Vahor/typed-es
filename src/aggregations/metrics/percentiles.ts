import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, ToDecimal } from "../../types/helpers";

type DefaultPercents = [1, 5, 25, 50, 75, 95, 99];

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

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-aggregation
 */
export type PercentilesAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	percentiles: {
		field: infer Field extends string;
		percents?: infer Percents;
		keyed?: infer Keyed;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, number> extends true
			? Keyed extends false
				? {
						values: PercentilesValues<
							Percents extends number[] ? Percents : DefaultPercents
						>;
					}
				: {
						values: PercentilesValuesToObject<
							PercentilesValues<
								Percents extends number[] ? Percents : DefaultPercents
							>
						>;
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
