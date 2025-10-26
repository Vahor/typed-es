import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-children-aggregation.html
 */
export type ChildrenAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { children: { type: string } }
	? Prettify<
			{
				doc_count: number;
			} & AppendSubAggs<BaseQuery, E, Index, Agg>
		>
	: never;
