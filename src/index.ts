import type { Client, estypes } from "@elastic/elasticsearch";

export type PossibleFields<Index, Indexes> = Index extends keyof Indexes
	? keyof Indexes[Index]
	: never;

type InferSource<T, Key extends string> = T extends {
	[k in Key]: (infer A)[];
}
	? A
	: never;

// start wildcard search
type ReplaceStarWithString<T extends string> =
	T extends `${infer Left}*${infer Right}`
		? `${Left}${string}${ReplaceStarWithString<Right>}`
		: T;
type MatchesWildcard<
	W extends string,
	Pattern extends string,
> = W extends ReplaceStarWithString<Pattern> ? true : false;

type WildcardSearch<Words, Search> = Words extends infer W extends string
	? Search extends infer S extends string
		? MatchesWildcard<W, S> extends true
			? W
			: never
		: never
	: never;
// end

export type RequestedFields<
	Query extends SearchRequest,
	Indexes,
	Index extends string = RequestedIndex<Query>,
	AllFields = Index extends keyof Indexes ? keyof Indexes[Index] : never,
	Source = Query["_source"],
> = Source extends readonly (infer Fields extends string)[]
	? Fields
	: Source extends {
				includes?: string[];
				include?: string[];
				excludes?: string[];
				exclude?: string[];
			}
		? Exclude<
				// TODO: check if we can do this better
					| InferSource<Source, "includes">
					| InferSource<Source, "include"> extends never
					? AllFields
					: InferSource<Source, "includes"> | InferSource<Source, "include">,
				InferSource<Source, "excludes"> | InferSource<Source, "exclude">
			>
		: Source extends false
			? never
			: AllFields;

export type RequestedIndex<Query extends SearchRequest> =
	Query["index"] extends string ? Query["index"] : never;

export type HasOption<
	Query extends SearchRequest,
	Option extends keyof Query,
	V = unknown,
> = Query[Option] extends V ? true : false;

export type ExtractAggsKey<Query extends SearchRequest> =
	ExtractAggs<Query> extends Record<infer K, unknown>
		? K extends string
			? K
			: never
		: never;

type ObjectKeysWithSpecificKeys<T, TargetKeys extends string> = {
	[k in keyof T]: T[k] extends Record<string, unknown>
		? TargetKeys extends keyof T[k]
			? k
			: never
		: never;
}[keyof T];

type NextAggsParentKey<
	Query extends Record<string, unknown>,
	Aggs = ExtractAggs<Query>,
> =
	| ObjectKeysWithSpecificKeys<Aggs, "date_histogram">
	| ObjectKeysWithSpecificKeys<Aggs, "terms">
	| ObjectKeysWithSpecificKeys<Aggs, AggFunction>
	| ObjectKeysWithSpecificKeys<Aggs, BucketAggFunction>;

type AggregationOutput<
	Query extends Record<string, unknown>,
	ElasticsearchIndexes,
	CurrentAggregationKey extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = CurrentAggregationKey extends never
	? never
	:
			| CompositeAggs<Query, ElasticsearchIndexes, CurrentAggregationKey, Index>
			| DateHistogramAggs<
					Query,
					ElasticsearchIndexes,
					CurrentAggregationKey,
					Index
			  >
			| TermsAggs<Query, CurrentAggregationKey>
			| SimpleAggs<Query, ElasticsearchIndexes, Index>
			| BucketAggs<Query, CurrentAggregationKey>;

type CompositeAggs<
	Query extends SearchRequest,
	ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = ExtractAggs<Query>[Key] extends { composite: unknown }
	? {
			after_key: Record<string, unknown>;
			buckets: PrettyArray<
				{
					key: Record<string, unknown>;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<ExtractAggs<Query>[Key]>]: AggregationOutput<
						ExtractAggs<Query>[Key],
						ElasticsearchIndexes,
						k,
						Index
					>;
				}
			>;
		}
	: never;

type TermsAggs<
	Query extends SearchRequest,
	Key extends keyof ExtractAggs<Query>,
> = ExtractAggs<Query>[Key] extends { terms: unknown }
	? {
			buckets: PrettyArray<{
				key: unknown;
				doc_count: number;
			}>;
		}
	: never;

type DateHistogramAggs<
	Query extends SearchRequest,
	ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = ExtractAggs<Query>[Key] extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<ExtractAggs<Query>[Key]>]: AggregationOutput<
						ExtractAggs<Query>[Key],
						ElasticsearchIndexes,
						k,
						Index
					>;
				}
			>;
		}
	: never;

type ExtractAggField<Agg> = {
	[K in keyof Agg]: {
		[Fn in Extract<keyof Agg[K], AggFunction>]: Agg[K][Fn] extends {
			field: infer F;
		}
			? { fn: Fn; field: F }
			: never;
	}[Extract<keyof Agg[K], AggFunction>];
}[keyof Agg];
type AggFunctionsNumber =
	| "sum"
	| "avg"
	| "max"
	| "min"
	| "value_count"
	| "cardinality";

type AggFunction = "last" | "first" | "stats" | AggFunctionsNumber;

type SimpleAggs<
	Query extends SearchRequest,
	Indexes,
	Index = RequestedIndex<Query>,
	Agg = ExtractAggField<ExtractAggs<Query>>,
> = Agg extends { fn: string; field: string }
	? {
			value: Agg["fn"] extends AggFunctionsNumber
				? number
				: Agg["fn"] extends "stats"
					? {
							count: number;
							min: number;
							max: number;
							avg: number;
							sum: number;
						}
					: // @ts-expect-error: I know what I'm doing
						Indexes[Index][Agg["field"]];
		}
	: never;

type ExtractBucketAgg<Agg> = Agg extends {
	[fn in Extract<BucketAggFunction, keyof Agg>]: { buckets_path: infer P };
}
	? P extends string
		? { path: P }
		: never
	: never;
type BucketAggFunction = "avg_bucket" | "sum_bucket";

type BucketAggs<
	Query extends SearchRequest,
	Key extends keyof ExtractAggs<Query>,
	Agg = ExtractBucketAgg<ExtractAggs<Query>[Key]>,
> = Agg extends { path: string }
	? {
			value: unknown;
		}
	: never;

type ElasticsearchIndexes = Record<string, Record<string, unknown>>;

type OverrideSearchResponse<Query extends SearchRequest, T, V> = Prettify<
	Omit<estypes.SearchResponse<T, V>, "hits"> & {
		hits: Omit<estypes.SearchHitsMetadata<T>, "total" | "hits"> & {
			total: HasOption<Query, "track_total_hits", false> extends true
				? never
				: HasOption<Query, "rest_total_hits_as_int", true> extends true
					? number
					: estypes.SearchTotalHits;
			hits: Array<
				Omit<estypes.SearchHitsMetadata<T>["hits"][number], "_source"> & {
					_source: Query["_source"] extends false ? never : T;
				}
			>;
		};
	}
>;

export type ElasticsearchOutput<
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string = RequestedIndex<Query>,
> = Index extends keyof E
	? OverrideSearchResponse<
			Query,
			{
				[K in WildcardSearch<
					keyof E[Index],
					RequestedFields<Query, E>
				>]: K extends keyof E[Index]
					? E[Index][K]
					: `Field '${K extends string
							? K
							: "unknown"}' not found in index '${Index}'`;
			},
			{
				// @ts-expect-error: Query is BaseQuery not Record<string, unknown> but we know it
				[K in ExtractAggsKey<Query>]: AggregationOutput<Query, E, K, Index>;
			}
		>
	: `Index '${Index}' not found`;

export type SearchRequest = estypes.SearchRequest;

type AnyString = string & {};

export type TypedSearchRequest<Indexes extends ElasticsearchIndexes> = Omit<
	SearchRequest,
	"index" | "_source"
> &
	{
		[K in keyof Indexes]: {
			index: K;
			_source?:
				| Array<keyof Indexes[K] | AnyString>
				| false
				| {
						includes?: Array<keyof Indexes[K]>;
						include?: Array<keyof Indexes[K]>;
						excludes?: Array<keyof Indexes[K]>;
						exclude?: Array<keyof Indexes[K]>;
				  };
		};
	}[keyof Indexes];

type ExtractAggs<V> = V extends { aggs: infer A } | { aggregations: infer A }
	? A
	: never;

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
type PrettyArray<T> = Array<Prettify<T>>;

// @ts-expect-error: We are overriding types, but it's fine
export interface TypedClient<E extends ElasticsearchIndexes> extends Client {
	search<Query extends TypedSearchRequest<E>>(
		query: Query,
		// @ts-expect-error: Same as above
	): Promise<ElasticsearchOutput<Query, E>>;
}

export function typedEs<
	Indexes extends ElasticsearchIndexes,
	const Query extends TypedSearchRequest<Indexes>,
>(_client: TypedClient<Indexes>, query: Query): Query {
	return query;
}
