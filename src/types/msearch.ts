import type { estypes } from "@elastic/elasticsearch";
import type { ElasticsearchIndexes, SearchRequest, SearchResponse } from "../lib";

// Msearch header object - contains parameters for the subsequent search body
export type MultiSearchHeader = {
	index?: string | string[];
	allow_no_indices?: boolean;
	expand_wildcards?: "all" | "open" | "closed" | "hidden" | "none" | Array<"all" | "open" | "closed" | "hidden" | "none">;
	ignore_unavailable?: boolean;
	preference?: string;
	request_cache?: boolean;
	routing?: string;
	search_type?: "query_then_fetch" | "dfs_query_then_fetch";
	ccs_minimize_roundtrips?: boolean;
	allow_partial_search_results?: boolean;
	ignore_throttled?: boolean;
};

// Individual search request in msearch
export type MultiSearchRequestItem<Indexes extends ElasticsearchIndexes> = {
	header?: MultiSearchHeader;
	body: SearchRequest;
};

// Array of search requests for msearch
export type MultiSearchRequest<Indexes extends ElasticsearchIndexes> = Array<MultiSearchRequestItem<Indexes>>;

// Msearch response - contains array of individual search responses
export type MultiSearchResponse<
	Requests extends MultiSearchRequest<Indexes>,
	Indexes extends ElasticsearchIndexes
> = {
	took: number;
	responses: Array<
		| SearchResponse<Requests[number]["body"], Indexes>
		| estypes.ErrorResponseBase
	>;
};

// Helper type to extract the response type for a specific request
export type MultiSearchResponseItem<
	Request extends MultiSearchRequestItem<Indexes>,
	Indexes extends ElasticsearchIndexes
> = SearchResponse<Request["body"], Indexes> | estypes.ErrorResponseBase;

// Msearch options that can be passed to the msearch method
export type MultiSearchOptions = {
	allow_no_indices?: boolean;
	ccs_minimize_roundtrips?: boolean;
	expand_wildcards?: "all" | "open" | "closed" | "hidden" | "none" | Array<"all" | "open" | "closed" | "hidden" | "none">;
	ignore_throttled?: boolean;
	ignore_unavailable?: boolean;
	include_named_queries_score?: boolean;
	max_concurrent_searches?: number;
	max_concurrent_shard_requests?: number;
	pre_filter_shard_size?: number;
	rest_total_hits_as_int?: boolean;
	routing?: string;
	search_type?: "query_then_fetch" | "dfs_query_then_fetch";
	typed_keys?: boolean;
}; 