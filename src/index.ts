export type * as BucketAggregations from "./aggregations/bucket";
export type * as MetricAggregations from "./aggregations/metrics";
export type * as PipelineAggregations from "./aggregations/pipeline";
export * from "./client";
export * from "./lib";
export * from "./typed-es";
export type {
	ExtractQuery_Source, // TODO: should probably be renamed if we want to export it
	ExtractQueryFields,
} from "./types/requested-fields";
