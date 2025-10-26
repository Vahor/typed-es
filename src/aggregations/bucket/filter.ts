import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { Prettify } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filter-aggregation
 */
export type FilterAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { filter: object }
	? Prettify<
			{
				doc_count: number;
			} & AppendSubAggs<BaseQuery, E, Index, Agg>
		>
	: never;
