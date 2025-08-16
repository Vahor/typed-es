import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	TypeOfField,
} from "../..";
import type { IsSomeSortOf, IsStringLiteral, Not } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-matrix-stats-aggregation
export type MatrixStatsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	matrix_stats: {
		fields: infer Field extends Array<string>;
	};
}
	? {
			doc_count: number;
			fields: {
				[index in keyof Field]: Not<
					CanBeUsedInAggregation<Field[index], Index, E>
				> extends true
					? InvalidFieldInAggregation<Field[index], Index, Agg>
					: Not<
								IsSomeSortOf<TypeOfField<Field[index], E, Index>, number>
							> extends true
						? InvalidFieldTypeInAggregation<
								Field[index],
								Index,
								Agg,
								TypeOfField<Field[index], E, Index>,
								number
							>
						: {
								name: Field[index];
								count: number;
								mean: number;
								variance: number;
								skewness: number;
								kurtosis: number;
								covariance: Record<Field[number], number>;
								correlation: {
									[K in Field[number]]: K extends Field[index]
										? IsStringLiteral<K> extends true
											? 1
											: number
										: number;
								};
							};
			};
		}
	: never;
