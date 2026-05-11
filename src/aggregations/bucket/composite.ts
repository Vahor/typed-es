import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray } from "../../types/helpers";
import type { KeyedBucketBase } from "../helpers";

type CompositeSources = Array<Record<string, unknown>>;

type ExtractSourcesKeys<Sources extends CompositeSources> = {
	[k in keyof Sources]: keyof Sources[k];
}[number];

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-composite-aggregation
 */
export type Composite<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	composite: { sources: infer Sources extends CompositeSources };
}
	? {
			after_key: Record<ExtractSourcesKeys<Sources>, unknown>;
			buckets: PrettyArray<
				KeyedBucketBase<Record<ExtractSourcesKeys<Sources>, unknown>> &
					AppendSubAggs<BaseQuery, E, Index, Agg>
			>;
		}
	: never;
