import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify } from "../../types/helpers";
import type { BucketBase } from "../helpers";

/**
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-nested-aggregation.html
 */
export type Nested<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { nested: { path: string } }
	? Prettify<BucketBase & AppendSubAggs<BaseQuery, E, Index, Agg>>
	: never;
