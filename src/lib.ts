import type { estypes } from "@elastic/elasticsearch";
import type {
	BucketAggFunction,
	BucketAggs,
} from "./aggregations/bucket/bucket_agg";
import type { CompositeAggs } from "./aggregations/bucket/composite";
import type { DateHistogramAggs } from "./aggregations/bucket/date_histogram";
import type { DateRangeAggs } from "./aggregations/bucket/date_range";
import type { FiltersAggs } from "./aggregations/bucket/filters";
import type { GeoHexGridAggs } from "./aggregations/bucket/geohex_grid";
import type { GeoTileGridAggs } from "./aggregations/bucket/geotile_grid";
import type { HistogramAggs } from "./aggregations/bucket/histogram";
import type { IpPrefixAggs } from "./aggregations/bucket/ip_prefix";
import type { IpRangeAggs } from "./aggregations/bucket/ip_range";
import type { RangeAggs } from "./aggregations/bucket/range";
import type { TermsAggs } from "./aggregations/bucket/terms";
import type { BoxplotAggs } from "./aggregations/metrics/boxplot";
import type { CartesianCentroidAggs } from "./aggregations/metrics/cartesian_centroid";
import type { ExtendedStatsAggs } from "./aggregations/metrics/extended_stats";
import type {
	AggFunction,
	FunctionAggs,
} from "./aggregations/metrics/function";
import type { GeoBoundsAggs } from "./aggregations/metrics/geo_bounds";
import type { GeoCentroidAggs } from "./aggregations/metrics/geo_centroid";
import type { GeoLineAggs } from "./aggregations/metrics/geo_line";
import type { MatrixStatsAggs } from "./aggregations/metrics/matrix_stats";
import type { MedianAbsoluteDeviationAggs } from "./aggregations/metrics/median_absolute_deviation";
import type { PercentileRanksAggs } from "./aggregations/metrics/percentile_ranks";
import type { PercentilesAggs } from "./aggregations/metrics/percentiles";
import type { RateAggs } from "./aggregations/metrics/rate";
import type { ScriptedMetricAggs } from "./aggregations/metrics/scripted_metric";
import type { StatsAggs } from "./aggregations/metrics/stats";
import type { StringStatsAggs } from "./aggregations/metrics/string_stats";
import type { TopHitsAggs } from "./aggregations/metrics/top_hits";
import type { TopMetricsAggs } from "./aggregations/metrics/top_metrics";
import type { WeightedAvgAggs } from "./aggregations/metrics/weighted_avg";
import type {
	AnyString,
	IsNever,
	IsStringLiteral,
	ToString,
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
			[K in T as IsParentKeyALeaf<K, E, Index> extends true ? K : never]: K;
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

export type CanBeUsedInAggregation<
	Field extends string,
	Index extends string,
	E extends ElasticsearchIndexes,
> = IsStringLiteral<Field> extends false
	? true
	: Field extends PossibleFields<Index, E, true, true>
		? true
		: false;

export type InvalidFieldInAggregation<
	Field extends string,
	Index extends string,
	Aggregation,
> = {
	error: `Field '${Field}' cannot be used in aggregation on '${Index}'`;
	aggregation: Aggregation;
};

export type InvalidFieldTypeInAggregation<
	Field extends string,
	Index extends string,
	Aggregation,
	got,
	expected,
> = {
	error: `Field '${Field}' cannot be used in aggregation on '${Index}' because it is of type '${ToString<got>}' but expected '${ToString<expected>}'`;
	field: Field;
	aggregation: Aggregation;
	got: got;
	expected: expected;
};

export type InvalidPropertyTypeInAggregation<
	PropertyName extends string,
	Aggregation,
	got,
	expected,
> = {
	aggregation: Aggregation;
	property: PropertyName;
	got: got;
	expected: expected;
};

export type PossibleFieldsWithWildcards<
	Index,
	Indexes extends ElasticsearchIndexes,
	OnlyLeaf = false,
> = PossibleFields<Index, Indexes, OnlyLeaf> | AnyString;

export type TypeOfField<
	Field extends string,
	Indexes extends ElasticsearchIndexes,
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
	| "boxplot"
	| "cartesian_centroid"
	| "date_histogram"
	| "date_range"
	| "extended_stats"
	| "filters"
	| "geo_bounds"
	| "geo_centroid"
	| "geo_line"
	| "geohex_grid"
	| "geotile_grid"
	| "histogram"
	| "ip_prefix"
	| "ip_range"
	| "matrix_stats"
	| "median_absolute_deviation"
	| "percentile_ranks"
	| "percentiles"
	| "range"
	| "rate"
	| "scripted_metric"
	| "stats"
	| "string_stats"
	| "terms"
	| "top_hits"
	| "top_metrics"
	| "weighted_avg"
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
			| DateRangeAggs<BaseQuery, E, Index, Agg>
			| FiltersAggs<BaseQuery, E, Index, Agg>
			| GeoHexGridAggs<BaseQuery, E, Index, Agg>
			| GeoTileGridAggs<BaseQuery, E, Index, Agg>
			| HistogramAggs<BaseQuery, E, Index, Agg>
			| IpPrefixAggs<BaseQuery, E, Index, Agg>
			| IpRangeAggs<BaseQuery, E, Index, Agg>
			| RangeAggs<BaseQuery, E, Index, Agg>
			| TermsAggs<BaseQuery, E, Index, Agg>
			//
			| BoxplotAggs<E, Index, Agg>
			| CartesianCentroidAggs<E, Index, Agg>
			| ExtendedStatsAggs<E, Index, Agg>
			| FunctionAggs<E, Index, Agg>
			| GeoBoundsAggs<E, Index, Agg>
			| GeoCentroidAggs<E, Index, Agg>
			| GeoLineAggs<E, Index, Agg>
			| MatrixStatsAggs<E, Index, Agg>
			| MedianAbsoluteDeviationAggs<E, Index, Agg>
			| PercentilesAggs<E, Index, Agg>
			| PercentileRanksAggs<E, Index, Agg>
			| RateAggs<E, Index, Agg>
			| ScriptedMetricAggs<Agg>
			| StatsAggs<E, Index, Agg>
			| StringStatsAggs<E, Index, Agg>
			| TopHitsAggs<BaseQuery, E, Index, Agg>
			| TopMetricsAggs<E, Index, Agg>
			| WeightedAvgAggs<E, Index, Agg>
			//
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
