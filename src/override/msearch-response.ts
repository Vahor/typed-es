import type { estypes } from "@elastic/elasticsearch";
import type { ElasticsearchIndexes, TypedSearchRequest } from "../lib";
import type {
	AlternatingPair,
	IsNever,
	Prettify,
	UnionToIntersection,
} from "../types/helpers";
import type { TypedSearchResponse } from "./search-response";

type PairType<E extends ElasticsearchIndexes> = {
	header: Omit<estypes.MsearchMultisearchHeader, "index"> & { index?: keyof E };
	request: Omit<TypedSearchRequest<E>, "index">;
};
type PopPair<Data> = Data extends [infer H, infer T, ...infer Rest]
	? { header: H; request: T; rest: Rest }
	: never;

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
			: [
					{
						// TODO: make this pretty
						data: PopPair<
							[
								"index" extends keyof UnionToIntersection<T>
									? Pick<UnionToIntersection<T>, "index">
									: {},
								Prettify<Omit<UnionToIntersection<T>, "index">>,
							]
						>;
					},
				]
		: [];

export type TypedMsearchRequest<Indexes extends ElasticsearchIndexes> = {
	index: keyof Indexes;
	searches: MRequestSearches<Indexes>;
};

export type MRequestSearches<E extends ElasticsearchIndexes> =
	| AlternatingPair<PairType<E>["header"], PairType<E>["request"]>
	| Array<PairType<E>["header"] | PairType<E>["request"]>;

type ParsedSearches<
	Query extends TypedMsearchRequest<E>,
	E extends ElasticsearchIndexes,
	P = ExtractAllPairs<Query["searches"]>,
> = {
	[index in keyof P]: IsNever<P[index]> extends true
		? never
		: P[index] extends { data: PairType<E> }
			? {
					Index: P[index]["data"]["header"]["index"] extends string
						? P[index]["data"]["header"]["index"]
						: Query["index"];
					Query: P[index]["data"]["request"];
				}
			: never;
};

export type TypedMSearchResponse<
	Query extends TypedMsearchRequest<E>,
	E extends ElasticsearchIndexes,
	Pairs = ParsedSearches<Query, E>,
> = Omit<estypes.MsearchResponse, "responses"> & {
	responses: {
		[Index in keyof Pairs]:
			| TypedSearchResponse<
					// @ts-expect-error: TODO: see why ts is no happy about this
					{ index: Pairs[Index]["Index"] } & Omit<
						// @ts-expect-error: TODO: see why ts is no happy about this
						Pairs[Index]["Query"],
						"index"
					>,
					E
			  >
			| (estypes.ErrorResponseBase & { hits: undefined });
	};
};
