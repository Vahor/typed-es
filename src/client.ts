import type { Client } from "@elastic/elasticsearch";
import type {
	ElasticsearchIndexes,
	ElasticsearchOutput,
	TypedSearchRequest,
} from ".";
import type {
	MultiSearchRequest,
	MultiSearchResponse,
	MultiSearchOptions,
} from "./types/msearch";

// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	search<Query extends TypedSearchRequest<E>>(
		query: Query,
		// @ts-expect-error: Same as above
	): Promise<ElasticsearchOutput<Query, E>>;
	
	msearch<Requests extends MultiSearchRequest<E>>(
		params: {
			searches: Requests;
		} & MultiSearchOptions,
	): Promise<MultiSearchResponse<Requests, E>>;
}
