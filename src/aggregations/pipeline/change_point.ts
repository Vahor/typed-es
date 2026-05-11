import type {
	AggregationOutput,
	ElasticsearchIndexes,
	ExtractAggs,
	SearchRequest,
} from "../../lib";
import type { Prettify } from "../../types/helpers";
import type { BucketsPath } from "./types";

type ChangePointDetails = {
	p_value: number;
	change_point: number;
};

export type ChangePointType =
	| { dip: ChangePointDetails }
	| { distribution_change: ChangePointDetails }
	| { indeterminable: { reason: string } }
	| { non_stationary: { p_value: number; r_value: number; trend: string } }
	| { spike: ChangePointDetails }
	| { stationary: Record<never, never> }
	| { step_change: ChangePointDetails }
	| {
			trend_change: { p_value: number; r_value: number; change_point: number };
	  };

type FirstBucketsPathSegment<Path> = Path extends `${infer Parent}>${string}`
	? Parent
	: Path;

type ChangePointFallbackBucket = {
	key: string | number;
	doc_count: number;
} & Record<string, unknown>;

type ChangePointBucketFromAggregation<Aggregation> = Aggregation extends {
	buckets: Array<infer Bucket>;
}
	? Prettify<{ key: string | number } & Omit<Bucket, "key" | "key_as_string">>
	: Aggregation extends { buckets: Record<string, infer Bucket> }
		? Prettify<{ key: string | number } & Omit<Bucket, "key" | "key_as_string">>
		: ChangePointFallbackBucket;

type ChangePointBucketFromPath<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	Index extends string,
	BucketPath,
> = BucketPath extends string
	? FirstBucketsPathSegment<BucketPath> extends infer ParentAggregation extends
			keyof ExtractAggs<Query>
		? ChangePointBucketFromAggregation<
				AggregationOutput<BaseQuery, Query, E, ParentAggregation, Index>
			>
		: ChangePointFallbackBucket
	: ChangePointFallbackBucket;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-change-point-aggregation
 */
export type ChangePoint<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	change_point: {
		buckets_path: infer BucketPath extends BucketsPath;
	};
}
	? {
			bucket?: ChangePointBucketFromPath<
				BaseQuery,
				Query,
				E,
				Index,
				BucketPath
			>;
			type: ChangePointType;
		}
	: never;
