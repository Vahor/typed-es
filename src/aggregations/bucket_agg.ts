import type { ExtractAggs, SearchRequest } from "..";

export type BucketAggFunction = "avg_bucket" | "sum_bucket";

type ExtractBucketAgg<Agg> = Agg extends {
	[fn in Extract<BucketAggFunction, keyof Agg>]: { buckets_path: infer P };
}
	? P extends string
		? { path: P }
		: never
	: never;

export type BucketAggs<
	Query extends SearchRequest,
	Key extends keyof ExtractAggs<Query>,
	Agg = ExtractBucketAgg<ExtractAggs<Query>[Key]>,
> = Agg extends { path: string }
	? {
			value: unknown;
		}
	: never;
