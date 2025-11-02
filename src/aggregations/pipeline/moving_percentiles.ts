import type { ElasticsearchIndexes } from "../../lib";
import type { PercentilesAggs } from "../metrics/percentiles";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-moving-percentiles-aggregation
 *
 * > The output format of the moving_percentiles aggregation is inherited from the format of the referenced percentiles aggregation.
 */
export type MovingPercentilesAggs<
	SiblingAggregations,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	moving_percentiles: { buckets_path: infer BucketPath };
}
	? BucketPath extends keyof SiblingAggregations
		? PercentilesAggs<E, Index, SiblingAggregations[BucketPath]> | undefined
		: never
	: never;
