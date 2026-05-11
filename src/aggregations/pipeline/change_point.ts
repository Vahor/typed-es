import type { UnknownKeyedBucketBase } from "../helpers";
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

export type ChangePointBucket = UnknownKeyedBucketBase;

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-change-point-aggregation
 */
export type ChangePoint<_BaseQuery, _Query, _E, _Index, Agg> = Agg extends {
	change_point: {
		buckets_path: BucketsPath;
	};
}
	? {
			bucket?: ChangePointBucket;
			type: ChangePointType;
		}
	: never;
