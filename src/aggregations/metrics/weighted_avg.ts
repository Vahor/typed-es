import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, Not } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation
export type WeightedAvgAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	weighted_avg: {
		value: {
			field: infer ValueField extends string;
		};
		weight: {
			field: infer WeightField extends string;
		};
	};
}
	? Not<CanBeUsedInAggregation<ValueField, Index, E>> extends true
		? InvalidFieldInAggregation<ValueField, Index, Agg>
		: Not<CanBeUsedInAggregation<WeightField, Index, E>> extends true
			? InvalidFieldInAggregation<WeightField, Index, Agg>
			: Not<
						IsSomeSortOf<TypeOfField<WeightField, E, Index>, number>
					> extends true
				? InvalidFieldTypeInAggregation<
						WeightField,
						Index,
						Agg,
						TypeOfField<WeightField, E, Index>,
						number
					>
				: {
						value: number;
						value_as_string?: string;
					}
	: never;
