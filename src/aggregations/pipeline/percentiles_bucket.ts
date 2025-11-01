import type { ToDecimal } from "../../types/helpers";

type DefaultPercents = [1, 5, 25, 50, 75, 95, 99];
type GetPercents<Percents> = Percents extends number[]
	? Percents
	: DefaultPercents;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-percentiles-bucket-aggregation
 */
export type PercentilesBucketAggs<Agg> = Agg extends {
	percentiles_bucket: { buckets_path: string; percents?: infer Percents };
}
	? {
			values: {
				[key in GetPercents<Percents>[number] as ToDecimal<key>]: number;
			};
		}
	: never;
