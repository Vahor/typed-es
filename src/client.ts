import type { Client } from "@elastic/elasticsearch";
import type {
	ElasticsearchIndexes,
	ElasticsearchOutput,
	TypedSearchRequest,
} from ".";

// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	search<Query extends TypedSearchRequest<E>>(
		query: Query,
		// @ts-expect-error: Same as above
	): Promise<ElasticsearchOutput<Query, E>>;
}
