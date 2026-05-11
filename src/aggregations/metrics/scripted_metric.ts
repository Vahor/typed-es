/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-scripted-metric-aggregation
 */
export type ScriptedMetric<Agg> = Agg extends { scripted_metric: unknown }
	? {
			value: unknown;
		}
	: never;
