import type { ElasticsearchIndexes, TypedClient, TypedSearchRequest } from ".";

export function typedEs<
	Indexes extends ElasticsearchIndexes,
	const Query extends TypedSearchRequest<Indexes>,
>(_client: TypedClient<Indexes>, query: Query): Query {
	return query;
}
