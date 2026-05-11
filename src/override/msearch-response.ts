import type { estypes } from "@elastic/elasticsearch";
import type {
	ElasticsearchIndex,
	ElasticsearchIndexes,
	RequestedIndex,
	SearchRequest,
	TypedSearchRequest,
} from "../lib";
import type {
	AlternatingPair,
	IsNever,
	Prettify,
	RArray,
	UnionToIntersection,
} from "../types/helpers";
import type { TypedSearchResponse } from "./search-response";

type PairType<E extends ElasticsearchIndexes> = {
	header: Omit<estypes.MsearchMultisearchHeader, "index"> & {
		index?: ElasticsearchIndex<E>;
	};
	request: Omit<TypedSearchRequest<E>, "index">;
};
type PopPair<Data> = Data extends [infer H, infer T, ...infer Rest]
	? { header: H; request: T; rest: Rest }
	: never;

type PairFromSearchItem<T> = PopPair<
	[
		"index" extends keyof UnionToIntersection<T>
			? Pick<UnionToIntersection<T>, "index">
			: {},
		Prettify<Omit<UnionToIntersection<T>, "index">>,
	]
>;

type ExtractAllPairs<Data> = Data extends readonly [
	infer H,
	infer T,
	...infer Rest,
]
	? [
			{ data: PopPair<[H, T, ...Rest]> },
			...ExtractAllPairs<
				Rest extends readonly [unknown, unknown, ...unknown[]] ? Rest : []
			>,
		]
	: Data extends Array<infer T>
		? IsNever<T> extends true
			? []
			: [{ data: PairFromSearchItem<T> }]
		: [];

export type TypedMsearchRequest<Indexes extends ElasticsearchIndexes> = Omit<
	estypes.MsearchRequest,
	"index" | "searches"
> & {
	index: ElasticsearchIndex<Indexes>;
	searches: MRequestSearches<Indexes>;
};

export type MRequestSearches<E extends ElasticsearchIndexes> =
	| AlternatingPair<PairType<E>["header"], PairType<E>["request"]>
	| RArray<PairType<E>["header"] | PairType<E>["request"]>;

type ParsedSearches<
	Query extends TypedMsearchRequest<E>,
	E extends ElasticsearchIndexes,
	P = ExtractAllPairs<Query["searches"]>,
> = {
	[index in keyof P]: IsNever<P[index]> extends true
		? never
		: P[index] extends { data: PairType<E> }
			? {
					Index: IsNever<
						RequestedIndex<P[index]["data"]["header"]>
					> extends true
						? RequestedIndex<Query>
						: RequestedIndex<P[index]["data"]["header"]>;
					Query: P[index]["data"]["request"];
				}
			: never;
};

type InheritRestTotalHitsAsInt<Search, Parent> = Search extends {
	rest_total_hits_as_int: unknown;
}
	? Search
	: Parent extends { rest_total_hits_as_int: infer RestTotalHitsAsInt }
		? Search & { rest_total_hits_as_int: RestTotalHitsAsInt }
		: Search;

type TypedMSearchResponseForPair<
	Query extends TypedMsearchRequest<E>,
	E extends ElasticsearchIndexes,
	Pair,
> = Pair extends {
	Index: infer Index extends string;
	Query: infer Search extends SearchRequest;
}
	? { index: Index } & Omit<
			InheritRestTotalHitsAsInt<Search, Query>,
			"index"
		> extends infer ResponseQuery extends SearchRequest
		? TypedSearchResponse<ResponseQuery, E>
		: never
	: never;

export type TypedMSearchResponse<
	Query extends TypedMsearchRequest<E>,
	E extends ElasticsearchIndexes,
	Pairs = ParsedSearches<Query, E>,
> = Omit<estypes.MsearchResponse, "responses"> & {
	responses: {
		[Index in keyof Pairs]:
			| TypedMSearchResponseForPair<Query, E, Pairs[Index]>
			| (estypes.ErrorResponseBase & { hits: undefined });
	};
};
