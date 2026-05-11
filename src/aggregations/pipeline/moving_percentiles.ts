import type { ElasticsearchIndexes } from "../../lib";
import type { Percentiles } from "../metrics/percentiles";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-moving-percentiles-aggregation
 *
 * > The output format of the moving_percentiles aggregation is inherited from the format of the referenced percentiles aggregation.
 */
export type MovingPercentiles<
	SiblingAggregations,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	moving_percentiles: { buckets_path: infer BucketPath };
}
	? BucketPath extends keyof SiblingAggregations
		? Percentiles<E, Index, SiblingAggregations[BucketPath]> | undefined
		: never
	: never;
