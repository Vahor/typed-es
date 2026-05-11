import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify } from "../../types/helpers";
import type { BucketBase } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-diversified-sampler-aggregation
 */
export type DiversifiedSampler<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { diversified_sampler: object }
	? Prettify<BucketBase & AppendSubAggs<BaseQuery, E, Index, Agg>>
	: never;
