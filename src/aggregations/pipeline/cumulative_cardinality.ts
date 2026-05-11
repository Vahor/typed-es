/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-cardinality-aggregation
 */
export type CumulativeCardinality<Agg> = Agg extends {
	cumulative_cardinality: { buckets_path: string };
}
	? {
			value: number;
			value_as_string?: string;
		}
	: never;
