import type { BucketsPath } from "./types";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-inference-bucket-aggregation
 */
export type Inference<Agg> = Agg extends {
	inference: {
		model_id: string;
		buckets_path: BucketsPath;
		inference_config?: unknown;
	};
}
	? unknown
	: never;
