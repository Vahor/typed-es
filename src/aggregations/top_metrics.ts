import type { ElasticsearchIndexes, TypeOfField } from "../lib";
import type { PrettyArray } from "../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-metrics
export type TopMetricsAggs<
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	top_metrics: { metrics: infer M extends Record<"field", string>[] };
}
	? {
			top: PrettyArray<{
				sort: unknown[];
				metrics: {
					[k in M[number]["field"]]: TypeOfField<k, E, Index>;
				};
			}>;
		}
	: never;
