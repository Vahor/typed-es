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

/**
 * Internal helper type that overrides the runtime AsyncSearch Get response
 * to provide a strongly-typed `response` field of type `TypedSearchResponse<Query, E>`.
 *
 * This preserves the rest of the runtime shape via `Omit<estypes.AsyncSearchGetResponse<T_Doc, T_Aggs>, "response">` and applies
 * the typed `response`.
 *
 * @template Query - The input query type
 * @template E - Elasticsearch index map
 * @template T_Source - Output type for _source
 * @template T_Fields - Output type for fields
 * @template T_Aggs - Output type for aggregations
 * @template T_Doc - Combined doc type (source|fields)
 */
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

/**
 * @template Query - The input query type
 * @template E - Elasticsearch index map
 * @template Index - The index string (defaulted via RequestedIndex<Query>)
 */
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
