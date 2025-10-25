import type { ElasticsearchIndexes, TypedClient, TypedSearchRequest } from ".";

/**
 * Creates a type-safe Elasticsearch search query with automatic type inference for results.
 *
 * This is a pass-through function that provides type safety and autocomplete for your
 * Elasticsearch queries. It validates the `index` name, `_source`, `fields`, and aggregations
 * against your defined index types, and enables automatic type inference for search results.
 *
 * @template Indexes - Your Elasticsearch index type definitions (automatically inferred)
 * @template Query - The search query (automatically inferred)
 *
 * @param _client - Your TypedClient instance (used for type inference only)
 * @param query - The Elasticsearch search query
 * @returns The same query, but with enhanced type information
 *
 * @example
 * ```typescript
 * type MyIndexes = {
 *   "products": {
 *     id: number;
 *     name: string;
 *     price: number;
 *     created_at: string;
 *   }
 * };
 *
 * const client = new Client({...}) as unknown as TypedClient<MyIndexes>;
 *
 * // Basic query with _source
 * const query = typedEs(client, {
 *   index: "products",
 *   _source: ["id", "name"]
 * });
 *
 * const result = await client.search(query);
 * // result.hits.hits[0]._source is typed as { id: number; name: string }
 * ```
 *
 * @example
 * ```typescript
 * // Query with wildcards in _source
 * const query = typedEs(client, {
 *   index: "products",
 *   _source: ["id", "*_at"]  // Matches created_at
 * });
 *
 * const result = await client.search(query);
 * // result.hits.hits[0]._source is typed as { id: number; created_at: string }
 * ```
 *
 * @example
 * ```typescript
 * // Query with aggregations
 * const query = typedEs(client, {
 *   index: "products",
 *   _source: ["name"],
 *   aggs: {
 *     price_stats: {
 *       stats: { field: "price" }
 *     }
 *   }
 * });
 *
 * const result = await client.search(query);
 * // result.aggregations.price_stats contains typed stats output
 * ```
 *
 * @see {@link TypedClient} for client setup
 * @see {@link TypedSearchRequest} for available query options
 */
export function typedEs<
	Indexes extends ElasticsearchIndexes,
	const Query extends TypedSearchRequest<Indexes>,
>(_client: TypedClient<Indexes>, query: Query): Query {
	return query;
}
