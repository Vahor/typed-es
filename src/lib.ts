import type { estypes } from "@elastic/elasticsearch";
import type { BucketAggFunction, BucketAggs } from "./aggregations/bucket_agg";
import type { CompositeAggs } from "./aggregations/composite";
import type { DateHistogramAggs } from "./aggregations/date_histogram";
import type { DateRangeAggs } from "./aggregations/date_range";
import type { FiltersAggs } from "./aggregations/filters";
import type { AggFunction, FunctionAggs } from "./aggregations/function";
import type { HistogramAggs } from "./aggregations/histogram";
import type { RangeAggs } from "./aggregations/range";
import type { ScriptedMetricAggs } from "./aggregations/scripted_metric";
import type { TermsAggs } from "./aggregations/terms";
import type { TopHitsAggs } from "./aggregations/top_hits";
import type { TopMetricsAggs } from "./aggregations/top_metrics";
import type {
	AnyString,
	IsNever,
	Prettify,
	UnionToIntersection,
} from "./types/helpers";
import type {
	ExpandAll,
	FLAT_UNKNOWN,
	JoinKeys,
	Primitive,
	RecursiveDotNotation,
	RemoveLastDot,
} from "./types/object-to-dot-notation";
import type {
	ExtractQuery_Source,
	ExtractQueryFields,
} from "./types/requested-fields";
import type {
	InverseWildcardSearch,
	WildcardSearch,
} from "./types/wildcard-search";

type WithVariants<T extends string> = `${T}.${string}` | T;
type FilterToOnlyLeaf<
	T extends string,
	E extends ElasticsearchIndexes,
	Index,
> = Index extends string
	? keyof {
			[K in T as IsParentKeyALeaf<K, E, Index, RemoveLastDot<K>> extends true
				? K
				: never]: K;
		}
	: never;

export type PossibleFields<
	Index,
	Indexes extends ElasticsearchIndexes,
	OnlyLeaf = false,
	AllowVariants = false,
> = Index extends keyof Indexes
	? AllowVariants extends true
		?
				| FilterToOnlyLeaf<
						WithVariants<JoinKeys<Indexes[Index], OnlyLeaf>>,
						Indexes,
						Index
				  >
				| JoinKeys<Indexes[Index], OnlyLeaf>
		: JoinKeys<Indexes[Index], OnlyLeaf>
	: never;

export type PossibleFieldsWithWildcards<
	Index,
	Indexes extends ElasticsearchIndexes,
	OnlyLeaf = false,
> = PossibleFields<Index, Indexes, OnlyLeaf> | AnyString;

export type TypeOfField<
	Field extends string,
	Indexes,
	Index extends keyof Indexes,
> = RecursiveDotNotation<Indexes[Index], Field>;

export type RequestedIndex<Query> = "index" extends keyof Query
	? Query["index"] extends string
		? Query["index"]
		: never
	: never;

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
		? TargetKeys extends keyof UnionToIntersection<T[k]>
			? k
			: never
		: never;
}[keyof T];

export type NextAggsParentKey<
	Query extends Record<string, unknown>,
	Aggs = ExtractAggs<Query>,
> = ObjectKeysWithSpecificKeys<
	Aggs,
	| "top_hits"
	| "date_histogram"
	| "terms"
	| "scripted_metric"
	| "top_metrics"
	| "range"
	| "filters"
	| "histogram"
	| "date_range"
	| AggFunction
	| BucketAggFunction
>;

export type AggregationOutput<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	CurrentAggregationKey extends keyof ExtractAggs<Query>,
	Index extends string = RequestedIndex<Query>,
	Agg = UnionToIntersection<ExtractAggs<Query>[CurrentAggregationKey]>,
> = IsNever<CurrentAggregationKey> extends true
	? never
	:
			| CompositeAggs<BaseQuery, E, Index, Agg>
			| DateHistogramAggs<BaseQuery, E, Index, Agg>
			| FiltersAggs<BaseQuery, E, Index, Agg>
			| RangeAggs<BaseQuery, E, Index, Agg>
			| DateRangeAggs<BaseQuery, E, Index, Agg>
			| TermsAggs<BaseQuery, E, Index, Agg>
			| TopHitsAggs<BaseQuery, E, Index, Agg>
			| FunctionAggs<E, Index, Agg>
			| HistogramAggs<BaseQuery, E, Index, Agg>
			| ScriptedMetricAggs<Agg>
			| TopMetricsAggs<E, Index, Agg>
			| BucketAggs<Agg>;

export type AppendSubAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
> = IsNever<NextAggsParentKey<Agg>> extends true
	? {}
	: {
			[k in NextAggsParentKey<Agg>]: AggregationOutput<
				BaseQuery,
				Agg,
				E,
				k,
				Index
			>;
		};

export type ElasticsearchIndexes = Record<string, Record<string, unknown>>;

export type QueryTotal<Query extends SearchRequest> = HasOption<
	Query,
	"track_total_hits",
	false
> extends true
	? never
	: HasOption<Query, "rest_total_hits_as_int", true> extends true
		? number
		: estypes.SearchTotalHits;

type OverrideSearchResponse<
	Query extends SearchRequest,
	T_Source,
	T_Fields,
	T_Aggs,
	T_Doc = UnionToIntersection<T_Source | T_Fields>,
> = Prettify<
	Omit<estypes.SearchResponse<T_Doc, T_Aggs>, "hits" | "aggregations"> & {
		hits: Omit<estypes.SearchHitsMetadata<T_Doc>, "total" | "hits"> & {
			total: QueryTotal<Query>;
			hits: Array<
				Omit<
					estypes.SearchHitsMetadata<T_Doc>["hits"][number],
					"_source" | "fields"
				> & {
					_source: Query["_source"] extends false ? never : T_Source;
					fields: "fields" extends keyof Query
						? T_Fields
						: "docvalue_fields" extends keyof Query
							? T_Fields
							: never;
				}
			>;
		};
	} & {
		aggregations: IsNever<ExtractAggs<Query>> extends true
			? never
			: NonNullable<T_Aggs>;
	}
>;

type IsParentKeyALeaf<
	K extends string,
	E extends ElasticsearchIndexes,
	Index extends string,
	ParentKey = RemoveLastDot<K>,
> = ParentKey extends string
	? IsNever<TypeOfField<ParentKey, E, Index>> extends true
		? false
		: TypeOfField<ParentKey, E, Index> extends Primitive | Array<Primitive>
			? true
			: false
	: false;

export type ElasticsearchOutputFields<
	QueryWithSource extends Partial<{ _source: unknown; fields: unknown }>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Type extends "_source" | "fields",
	//
	RequestedFields = Type extends "_source"
		? ExtractQuery_Source<QueryWithSource, E, Index>
		: ExtractQueryFields<QueryWithSource>,
	Output = {
		[K in WildcardSearch<
			PossibleFields<Index, E, Type extends "fields" ? true : false>,
			RequestedFields
		>]: TypeOfField<K, E, Index>;
	} & {
		[K in InverseWildcardSearch<
			PossibleFields<Index, E, Type extends "fields" ? true : false>,
			RequestedFields
		> as IsParentKeyALeaf<K, E, Index> extends true ? K : never]: FLAT_UNKNOWN;
	},
> = Type extends "_source"
	? ExpandAll<Output>
	: {
			[K in keyof Output as Output[K] extends FLAT_UNKNOWN
				? RemoveLastDot<K>
				: K]: Output[K] extends FLAT_UNKNOWN
				? Array<unknown>
				: Array<Output[K]>;
		};

export type ElasticsearchOutput<
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string = RequestedIndex<Query>,
> = Index extends keyof E
	? OverrideSearchResponse<
			Query,
			ElasticsearchOutputFields<Query, E, Index, "_source">,
			ElasticsearchOutputFields<Query, E, Index, "fields">,
			{
				[K in ExtractAggsKey<Query>]: AggregationOutput<
					Query,
					// @ts-expect-error: Query is BaseQuery not Record<string, unknown> but we know it
					Query,
					E,
					K,
					Index
				>;
			}
		>
	: `Index '${Index}' not found`;

export type SearchRequest = estypes.SearchRequest;

export type TypedSearchRequest<Indexes extends ElasticsearchIndexes> = Omit<
	SearchRequest,
	"index" | "_source" | "fields" | "docvalue_fields"
> &
	{
		[K in keyof Indexes]: {
			index: K;
			_source?:
				| Array<PossibleFieldsWithWildcards<K, Indexes>>
				| false
				| {
						includes?: Array<PossibleFieldsWithWildcards<K, Indexes>>;
						include?: Array<PossibleFieldsWithWildcards<K, Indexes>>;
						excludes?: Array<PossibleFieldsWithWildcards<K, Indexes>>;
						exclude?: Array<PossibleFieldsWithWildcards<K, Indexes>>;
				  };
			fields?: Array<
				| PossibleFieldsWithWildcards<K, Indexes, true>
				| {
						field: PossibleFieldsWithWildcards<K, Indexes, true>;
						format?: string;
				  }
			>;
			docvalue_fields?: Array<
				| PossibleFieldsWithWildcards<K, Indexes, true>
				| {
						field: PossibleFieldsWithWildcards<K, Indexes, true>;
						format?: string;
				  }
			>;
		};
	}[keyof Indexes];

export type ExtractAggs<V> = V extends
	| { aggs: infer A }
	| { aggregations: infer A }
	? A
	: never;
