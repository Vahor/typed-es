import type { ElasticsearchIndexes } from "../..";
import type { IsStringLiteral } from "../../types/helpers";
import type { AggregationFieldTypeResult } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-matrix-stats-aggregation
 */
export type MatrixStats<
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
				[index in keyof Field]: AggregationFieldTypeResult<
					E,
					Index,
					Agg,
					number,
					{
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
					},
					Field[index]
				>;
			};
		}
	: never;
