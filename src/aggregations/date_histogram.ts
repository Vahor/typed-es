import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";
import type { PrettyArray } from "../types/helpers";

export type DateHistogramAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
					doc_count: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>;
		}
	: never;
