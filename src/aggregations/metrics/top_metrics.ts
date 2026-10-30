import type { ElasticsearchIndexes, TypeOfField } from "../../lib";
import type { ArrayItem, PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-metrics
 */
export type TopMetrics<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	top_metrics: { metrics: infer M };
}
	? ArrayItem<M> extends { field: infer Field extends string }
		? {
				top: PrettyArray<{
					sort: unknown[];
					metrics: {
						[k in Field]: TypeOfField<k, E, Index>;
					};
				}>;
			}
		: never
	: never;
