/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-inference-bucket-aggregation
 */
export type Inference<Agg> = Agg extends {
	inference: {
		model_id: string;
		buckets_path: Record<string, string>;
		inference_config?: unknown;
	};
}
	? unknown
	: never;
