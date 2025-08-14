import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { PrettyArray } from "../../types/helpers";

type CompositeSources = Array<Record<string, unknown>>;

type ExtractSourcesKeys<Sources extends CompositeSources> = {
	[k in keyof Sources]: keyof Sources[k];
}[number];

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-composite-aggregation
export type CompositeAggs<
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
				{
					key: Record<ExtractSourcesKeys<Sources>, unknown>;
					doc_count: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>;
		}
	: never;
