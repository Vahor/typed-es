import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, Not } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation
 */
export type WeightedAvgAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	weighted_avg: {
		value: {
			field?: infer ValueField extends string;
			script?: string;
		};
		weight: {
			field?: infer WeightField extends string;
			script?: string;
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
				: Not<
							IsSomeSortOf<
								TypeOfField<ValueField, E, Index>,
								number | Array<number>
							>
						> extends true
					? InvalidFieldTypeInAggregation<
							ValueField,
							Index,
							Agg,
							TypeOfField<ValueField, E, Index>,
							number | Array<number>
						>
					: {
							value: number;
							value_as_string?: string;
						}
	: never;
