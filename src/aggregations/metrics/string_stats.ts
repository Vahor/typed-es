import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, Prettify } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-string-stats-aggregation
export type StringStatsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	string_stats: {
		field: infer Field extends string;
		show_distribution?: infer ShowDistribution;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, string> extends true
			? Prettify<
					{
						count: number;
						min_length: number;
						max_length: number;
						avg_length: number;
						entropy: number;
					} & {
						[K in "distribution" as ShowDistribution extends true
							? K
							: never]: Record<string, number>;
					}
				>
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					string
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
