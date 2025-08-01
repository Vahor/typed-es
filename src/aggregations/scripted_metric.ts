export type ScriptedMetricAggs<Agg> = Agg extends { scripted_metric: unknown }
	? {
			value: unknown;
		}
	: never;
