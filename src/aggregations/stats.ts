import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
} from "..";

export type StatsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	stats: {
		field: infer Field extends string;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? {
				count: number;
				min: number;
				max: number;
				avg: number;
				sum: number;
			}
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
