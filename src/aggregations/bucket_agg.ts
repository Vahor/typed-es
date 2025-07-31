export type BucketAggFunction = "avg_bucket" | "sum_bucket";

type ExtractBucketAgg<Agg> = Agg extends {
	[fn in Extract<BucketAggFunction, keyof Agg>]: { buckets_path: infer P };
}
	? P extends string
		? { path: P }
		: never
	: never;

export type BucketAggs<
	Agg,
	BucketAgg = ExtractBucketAgg<Agg>,
> = BucketAgg extends { path: string }
	? {
			value: unknown;
			value_as_string?: string;
		}
	: never;
