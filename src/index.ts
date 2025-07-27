import type { Client, estypes } from "@elastic/elasticsearch";

export type PossibleFields<Index, Indexes> = Index extends keyof Indexes
	? keyof Indexes[Index]
	: never;

export type RequestedFields<
	Query extends BaseQuery,
	Indexes,
	Index extends string = RequestedIndex<Query>,
> = Query["_source"] extends readonly (infer Fields)[]
	? Fields extends string
		? Fields
		: never
	: Query["_source"] extends false
		? never
		: Index extends keyof Indexes
			? keyof Indexes[Index]
			: never;

export type RequestedIndex<Query extends BaseQuery> =
	Query["index"] extends string ? Query["index"] : never;

export type HasOption<
	Query extends BaseQuery,
	Option extends keyof Query,
	V = unknown,
> = Query[Option] extends V ? true : false;

export type ExtractAggsKey<Query extends BaseQuery> =
	Query[aggs] extends Record<infer K, unknown>
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

type NextAggsParentKey<Query extends Record<string, unknown>> =
	| ObjectKeysWithSpecificKeys<Query[aggs], "date_histogram">
	| ObjectKeysWithSpecificKeys<Query[aggs], "terms">
	| ObjectKeysWithSpecificKeys<Query[aggs], AggFunction>
	| ObjectKeysWithSpecificKeys<Query[aggs], BucketAggFunction>;

type AggregationOutput<
	Query extends Record<string, unknown>,
	ElasticsearchIndexes,
	CurrentAggregationKey extends keyof Query[aggs],
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
			| SimpleAggs<Query, ElasticsearchIndexes, CurrentAggregationKey, Index>
			| BucketAggs<Query, CurrentAggregationKey>;

type CompositeAggs<
	Query extends BaseQuery,
	ElasticsearchIndexes,
	Key extends keyof Query[aggs],
	Index = RequestedIndex<Query>,
> = Query[aggs][Key] extends { composite: unknown }
	? {
			after_key: Record<string, unknown>;
			buckets: PrettyArray<
				{
					key: Record<string, unknown>;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<Query[aggs][Key]>]: AggregationOutput<
						Query[aggs][Key],
						ElasticsearchIndexes,
						k,
						Index
					>;
				}
			>;
		}
	: never;

type TermsAggs<
	Query extends BaseQuery,
	Key extends keyof Query[aggs],
> = Query[aggs][Key] extends { terms: unknown }
	? {
			buckets: PrettyArray<{
				key: unknown;
				doc_count: number;
			}>;
		}
	: never;

type DateHistogramAggs<
	Query extends BaseQuery,
	ElasticsearchIndexes,
	Key extends keyof Query[aggs],
	Index = RequestedIndex<Query>,
> = Query[aggs][Key] extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<Query[aggs][Key]>]: AggregationOutput<
						Query[aggs][Key],
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
	Query extends BaseQuery,
	Indexes,
	_Key extends keyof Query[aggs],
	Index = RequestedIndex<Query>,
	Agg = ExtractAggField<Query[aggs]>,
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
	Query extends BaseQuery,
	Key extends keyof Query[aggs],
	Agg = ExtractBucketAgg<Query[aggs][Key]>,
> = Agg extends { path: string }
	? {
			value: unknown;
		}
	: never;

type ElasticsearchIndexes = Record<string, Record<string, unknown>>;

type OverrideSearchResponse<Query extends BaseQuery, T, V> = Prettify<
	Omit<estypes.SearchResponse<T, V>, "hits"> & {
		hits: Omit<estypes.SearchHitsMetadata<T>, "total" | "hits"> & {
			total: HasOption<Query, "track_total_hits", false> extends true
				? never
				: NonNullable<estypes.SearchHitsMetadata<T>["total"]>;
			hits: Array<
				Omit<estypes.SearchHitsMetadata<T>["hits"][number], "_source"> & {
					_source: Query["_source"] extends false ? never : T;
				}
			>;
		};
	}
>;

export type ElasticsearchOutput<
	Query extends BaseQuery,
	E extends ElasticsearchIndexes,
> = RequestedIndex<Query> extends keyof E
	? OverrideSearchResponse<
			Query,
			{
				[K in RequestedFields<
					Query,
					E
				>]: K extends keyof E[RequestedIndex<Query>]
					? E[RequestedIndex<Query>][K]
					: `Field '${K extends string ? K : "unknown"}' not found in index '${RequestedIndex<Query>}'`;
			},
			{
				// @ts-expect-error: Query is BaseQuery not Record<string, unknown> but we know it
				[K in ExtractAggsKey<Query>]: AggregationOutput<Query, E, K>;
			}
		>
	: `Index '${RequestedIndex<Query>}' not found`;

type BaseQuery = estypes.SearchRequest;

export type TypedSearchRequest<Indexes extends ElasticsearchIndexes> = Omit<
	BaseQuery,
	"index" | "_source"
> &
	{
		[K in keyof Indexes]: {
			index: K;
			_source?: Array<keyof Indexes[K]> | false;
		};
	}[keyof Indexes];
type aggs = "aggs";
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
