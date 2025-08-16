import type { Client } from "@elastic/elasticsearch";
import type { ElasticsearchIndexes, TypedSearchRequest } from ".";
import type { TypedSearchResponse } from "./override/search-response";

// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	search<Query extends TypedSearchRequest<E>>(
		query: Query,
		// @ts-expect-error: Same as above
	): Promise<TypedSearchResponse<Query, E>>;
}
