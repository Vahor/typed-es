import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";
import type { PrettyArray } from "../types/helpers";

export type TermsAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { terms: unknown }
	? {
			buckets: PrettyArray<
				{
					key: unknown;
					doc_count: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>;
		}
	: never;
