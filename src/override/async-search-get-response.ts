import type { estypes } from "@elastic/elasticsearch";
import type {
	AggregationOutput,
	ElasticsearchIndexes,
	ElasticsearchOutputFields,
	ExtractAggsKey,
	RequestedIndex,
	SearchRequest,
} from "../lib";
import type { Prettify, UnionToIntersection } from "../types/helpers";
import type { TypedSearchResponse } from "./search-response";

type OverrideAsyncSearchGetResponse<
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	T_Source,
	T_Fields,
	T_Aggs,
	T_Doc = UnionToIntersection<T_Source | T_Fields>,
> = Prettify<
	Omit<estypes.AsyncSearchGetResponse<T_Doc, T_Aggs>, "response"> & {
		response: TypedSearchResponse<Query, E>;
	}
>;

export type TypedAsyncSearchGetResponse<
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string = RequestedIndex<Query>,
> = Index extends keyof E
	? OverrideAsyncSearchGetResponse<
			Query,
			E,
			ElasticsearchOutputFields<Query, E, Index, "_source">,
			ElasticsearchOutputFields<Query, E, Index, "fields">,
			{
				[K in ExtractAggsKey<Query>]: AggregationOutput<
					Query,
					Query,
					E,
					// @ts-expect-error: TODO
					K,
					Index
				>;
			}
		>
	: `Index '${Index}' not found`;
