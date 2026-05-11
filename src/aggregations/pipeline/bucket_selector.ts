/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-selector-aggregation
 *
 * `bucket_selector` filters buckets from its parent multi-bucket aggregation and
 * does not add its own entry to the response.
 */
export type BucketSelector<Agg> = Agg extends { bucket_selector: object }
	? never
	: never;
