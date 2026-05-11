import type { Prettify } from "../../types/helpers";
import type { BucketsPath } from "./types";

type BucketCountKSTestAlternative = "greater" | "less" | "two_sided";
type BucketCountKSTestOutput<Alternatives> =
	Alternatives extends readonly BucketCountKSTestAlternative[]
		? { [K in Alternatives[number]]: number }
		: { greater: number; less: number; two_sided: number };

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-count-ks-test-aggregation
 */
export type BucketCountKSTest<Agg> = Agg extends {
	bucket_count_ks_test: {
		buckets_path: BucketsPath;
		alternative?: infer Alternatives;
	};
}
	? Prettify<BucketCountKSTestOutput<Alternatives>>
	: never;
