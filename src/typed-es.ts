import type { ElasticsearchIndexes, TypedClient, TypedSearchRequest } from ".";
import type { MultiSearchRequest } from "./types/msearch";

export function typedEs<
	Indexes extends ElasticsearchIndexes,
	const Query extends TypedSearchRequest<Indexes>,
>(_client: TypedClient<Indexes>, query: Query): Query {
	return query;
}

export function typedMsearch<
	Indexes extends ElasticsearchIndexes,
	const Requests extends MultiSearchRequest<Indexes>,
>(_client: TypedClient<Indexes>, requests: Requests): Requests {
	return requests;
}
