import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";
import type { PrettyArray } from "../types/helpers";

export type DateHistogramAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	date_histogram: {
		field: string;
		keyed?: infer Keyed;
	};
}
	? Keyed extends true
		? {
				buckets: Record<
					string,
					{
						key_as_string: string;
						key: number;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
		: // array default (keyed: false)
			{
				buckets: PrettyArray<
					{
						key_as_string: string;
						key: number;
						doc_count: number;
					} & AppendSubAggs<BaseQuery, E, Index, Agg>
				>;
			}
	: never;
