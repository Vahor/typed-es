import type { Client, estypes } from "@elastic/elasticsearch";
import type {
	TransportRequestOptions,
	TransportRequestOptionsWithMeta,
	TransportRequestOptionsWithOutMeta,
	TransportResult,
} from "@elastic/transport";
import type { ElasticsearchIndexes, TypedSearchRequest } from ".";
import type { TypedAsyncSearchGetResponse } from "./override/async-search-get-response";
import type { TypedAsyncSearchSubmitResponse } from "./override/async-search-submit-response";
import type {
	TypedMSearchResponse,
	TypedMsearchRequest,
} from "./override/msearch-response";
import type { TypedSearchResponse } from "./override/search-response";

type TransportOptions =
	| TransportRequestOptionsWithMeta
	| TransportRequestOptionsWithOutMeta
	| TransportRequestOptions;

type WithTransport<
	T extends TransportOptions,
	Data,
> = T extends TransportRequestOptionsWithMeta
	? Promise<TransportResult<Data>>
	: Promise<Data>;

/**
 * A type-safe wrapper around the Elasticsearch Client that provides automatic type inference
 * for search results based on your query structure.
 *
 * @template E - Your Elasticsearch index type definitions
 *
 * @example
 * ```typescript
 * import { Client } from "@elastic/elasticsearch";
 * import { TypedClient } from "@vahor/typed-es";
 *
 * type MyIndexes = {
 *   "users": {
 *     id: number;
 *     name: string;
 *     email: string;
 *   }
 * };
 *
 * const client = new Client({
 *   node: "http://localhost:9200"
 * }) as unknown as TypedClient<MyIndexes>;
 *
 * // Now use with typedEs for full type safety
 * const query = typedEs(client, {
 *   index: "users",
 *   _source: ["id", "name"]
 * });
 *
 * const result = await client.search(query);
 * // result.hits.hits[0]._source is automatically typed as { id: string, name: string }
 * ```
 *
 * Note:
 * The cast `as unknown as TypedClient<MyIndexes>` is necessary because we're augmenting
 * the native Elasticsearch Client with stricter type definitions. This is safe and provides
 * better type checking for your queries and results.
 */
// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	/**
	 * Run a search. Get search hits that match the query defined in the request. You can provide search queries using the `q` query string parameter or the request body. If both are specified, only the query parameter is used. If the Elasticsearch security features are enabled, you must have the read index privilege for the target data stream, index, or alias. For cross-cluster search, refer to the documentation about configuring CCS privileges. To search a point in time (PIT) for an alias, you must have the `read` index privilege for the alias's data streams or indices. **Search slicing** When paging through a large number of documents, it can be helpful to split the search into multiple slices to consume them independently with the `slice` and `pit` properties. By default the splitting is done first on the shards, then locally on each shard. The local splitting partitions the shard into contiguous ranges based on Lucene document IDs. For instance if the number of shards is equal to 2 and you request 4 slices, the slices 0 and 2 are assigned to the first shard and the slices 1 and 3 are assigned to the second shard. IMPORTANT: The same point-in-time ID should be used for all slices. If different PIT IDs are used, slices can overlap and miss documents. This situation can occur because the splitting criterion is based on Lucene document IDs, which are not stable across changes to the index.
	 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-search | Elasticsearch API documentation}
	 */
	search<
		Query extends TypedSearchRequest<E>,
		O extends TransportOptions = TransportRequestOptionsWithOutMeta,
	>(
		query: Query,
		options?: O,
	): WithTransport<
		O,
		TypedSearchResponse<
			// @ts-expect-error: Same as above
			Query,
			E
		>
	>;

	/**
	 * Run multiple independent searches in a single request.
	 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-msearch | Elasticsearch API documentation}
	 */
	msearch<
		Query extends TypedMsearchRequest<E>,
		O extends TransportOptions = TransportRequestOptionsWithOutMeta,
	>(
		params: Query,
		options?: O,
	): WithTransport<O, TypedMSearchResponse<Query, E>>;

	asyncSearch: Omit<Client["asyncSearch"], "get" | "submit"> & {
		/**
		 * Get async search results. Retrieve the results of a previously submitted asynchronous search request. If the Elasticsearch security features are enabled, access to the results of a specific async search is restricted to the user or API key that submitted it.
		 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-async-search-submit | Elasticsearch API documentation}
		 */
		get<
			Query extends TypedSearchRequest<E>,
			O extends TransportOptions = TransportRequestOptionsWithOutMeta,
		>(
			params: estypes.AsyncSearchGetRequest,
			options?: O,
		): WithTransport<
			O,
			TypedAsyncSearchGetResponse<
				// @ts-expect-error: Same as above
				Query,
				E
			>
		>;

		/**
		 * Run an async search. When the primary sort of the results is an indexed field, shards get sorted based on minimum and maximum value that they hold for that field. Partial results become available following the sort criteria that was requested. Warning: Asynchronous search does not support scroll or search requests that include only the suggest section. By default, Elasticsearch does not allow you to store an async search response larger than 10Mb and an attempt to do this results in an error. The maximum allowed size for a stored async search response can be set by changing the `search.max_async_search_response_size` cluster level setting.
		 * @see {@link https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-async-search-submit | Elasticsearch API documentation}
		 */
		submit<
			Query extends TypedSearchRequest<E>,
			O extends TransportOptions = TransportRequestOptionsWithOutMeta,
		>(
			params: Query,
			options?: O,
		): WithTransport<
			O,
			TypedAsyncSearchSubmitResponse<
				// @ts-expect-error: Same as above
				Query,
				E
			>
		>;
	};
}
