import type { estypes } from "@elastic/elasticsearch";
import type { BucketAggFunction, BucketAggs } from "./aggregations/bucket_agg";
import type { CompositeAggs } from "./aggregations/composite";
import type { DateHistogramAggs } from "./aggregations/date_histogram";
import type { AggFunction, FunctionAggs } from "./aggregations/function";
import type { TermsAggs } from "./aggregations/terms";
import type { Prettify } from "./types/helpers";
import type {
	ExpandAll,
	JoinKeys,
	RecursiveDotNotation,
} from "./types/object-to-dot-notation";
import type { WildcardSearch } from "./types/wildcard-search";

export type PossibleFields<Index, Indexes> = Index extends keyof Indexes
	? JoinKeys<Indexes[Index]>
	: never;
export type TypeOfField<
	Field extends string,
	Indexes,
	Index extends keyof Indexes,
> = RecursiveDotNotation<Indexes[Index], Field>;

type InferSource<T, Key extends string> = T extends {
	[k in Key]: (infer A)[];
}
	? A
	: never;

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

export type NextAggsParentKey<
	Query extends Record<string, unknown>,
	Aggs = ExtractAggs<Query>,
> =
	| ObjectKeysWithSpecificKeys<Aggs, "date_histogram">
	| ObjectKeysWithSpecificKeys<Aggs, "terms">
	| ObjectKeysWithSpecificKeys<Aggs, AggFunction>
	| ObjectKeysWithSpecificKeys<Aggs, BucketAggFunction>;

export type AggregationOutput<
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
			| FunctionAggs<Query, ElasticsearchIndexes, Index>
			| BucketAggs<Query, CurrentAggregationKey>;

export type ElasticsearchIndexes = Record<string, Record<string, unknown>>;

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
			ExpandAll<{
				[K in WildcardSearch<
					PossibleFields<Index, E>,
					RequestedFields<Query, E, Index>
				>]: TypeOfField<K, E, Index>;
			}>,
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
				| Array<PossibleFields<K, Indexes> | AnyString>
				| false
				| {
						includes?: Array<PossibleFields<K, Indexes> | AnyString>;
						include?: Array<PossibleFields<K, Indexes> | AnyString>;
						excludes?: Array<PossibleFields<K, Indexes> | AnyString>;
						exclude?: Array<PossibleFields<K, Indexes> | AnyString>;
				  };
		};
	}[keyof Indexes];

export type ExtractAggs<V> = V extends
	| { aggs: infer A }
	| { aggregations: infer A }
	? A
	: never;
