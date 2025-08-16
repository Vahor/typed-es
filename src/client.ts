import type { Client, estypes } from "@elastic/elasticsearch";
import type {
	TransportRequestOptions,
	TransportRequestOptionsWithMeta,
	TransportRequestOptionsWithOutMeta,
} from "@elastic/transport";
import type { ElasticsearchIndexes, TypedSearchRequest } from ".";
import type { TypedSearchResponse } from "./override/search-response";

// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	/**
	 * Run a search. Get search hits that match the query defined in the request. You can provide search queries using the `q` query string parameter or the request body. If both are specified, only the query parameter is used. If the Elasticsearch security features are enabled, you must have the read index privilege for the target data stream, index, or alias. For cross-cluster search, refer to the documentation about configuring CCS privileges. To search a point in time (PIT) for an alias, you must have the `read` index privilege for the alias's data streams or indices. **Search slicing** When paging through a large number of documents, it can be helpful to split the search into multiple slices to consume them independently with the `slice` and `pit` properties. By default the splitting is done first on the shards, then locally on each shard. The local splitting partitions the shard into contiguous ranges based on Lucene document IDs. For instance if the number of shards is equal to 2 and you request 4 slices, the slices 0 and 2 are assigned to the first shard and the slices 1 and 3 are assigned to the second shard. IMPORTANT: The same point-in-time ID should be used for all slices. If different PIT IDs are used, slices can overlap and miss documents. This situation can occur because the splitting criterion is based on Lucene document IDs, which are not stable across changes to the index.
	 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-search | Elasticsearch API documentation}
	 */
	search<Query extends TypedSearchRequest<E>>(
		query: Query,
		options?:
			| TransportRequestOptionsWithOutMeta
			| TransportRequestOptionsWithMeta
			| TransportRequestOptions,

		// @ts-expect-error: Same as above
	): Promise<TypedSearchResponse<Query, E>>;

	asyncSearch: {
		/**
		 * Get async search results. Retrieve the results of a previously submitted asynchronous search request. If the Elasticsearch security features are enabled, access to the results of a specific async search is restricted to the user or API key that submitted it.
		 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-async-search-submit | Elasticsearch API documentation}
		 */
		get<_Query extends TypedSearchRequest<E>>(
			params: estypes.AsyncSearchGetRequest,
			options?:
				| TransportRequestOptionsWithOutMeta
				| TransportRequestOptionsWithMeta
				| TransportRequestOptions,
		): Promise<null>;
	};
}
