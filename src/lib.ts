import type { estypes } from "@elastic/elasticsearch";
import type { AdjacencyMatrixAggs } from "./aggregations/bucket/adjacency_matrix";
import type { AutoDateHistogramAggs } from "./aggregations/bucket/auto_date_histogram";
import type {
	BucketAggFunction,
	BucketAggs,
} from "./aggregations/bucket/bucket_agg";
import type { CategorizeTextAggs } from "./aggregations/bucket/categorize_text";
import type { ChildrenAggs } from "./aggregations/bucket/children";
import type { CompositeAggs } from "./aggregations/bucket/composite";
import type { DateHistogramAggs } from "./aggregations/bucket/date_histogram";
import type { DateRangeAggs } from "./aggregations/bucket/date_range";
import type { FilterAggs } from "./aggregations/bucket/filter";
import type { FiltersAggs } from "./aggregations/bucket/filters";
import type { GeoHashGridAggs } from "./aggregations/bucket/geohash_grid";
import type { GeoHexGridAggs } from "./aggregations/bucket/geohex_grid";
import type { GeoTileGridAggs } from "./aggregations/bucket/geotile_grid";
import type { HistogramAggs } from "./aggregations/bucket/histogram";
import type { IpPrefixAggs } from "./aggregations/bucket/ip_prefix";
import type { IpRangeAggs } from "./aggregations/bucket/ip_range";
import type { NestedAggs } from "./aggregations/bucket/nested";
import type { RangeAggs } from "./aggregations/bucket/range";
import type { SamplerAggs } from "./aggregations/bucket/sampler";
import type { SignificantTextAggs } from "./aggregations/bucket/significant_text";
import type { TermsAggs } from "./aggregations/bucket/terms";
import type { VariableWidthHistogramAggs } from "./aggregations/bucket/variable_width_histogram";
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
	DeepPickPaths,
	IsNever,
	IsStringLiteral,
	ToString,
	UnionToIntersection,
} from "./types/helpers";
import type {
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

/**
 * Extracts all possible field paths from an index, supporting nested objects via dot notation.
 *
 * @template Index - The index name
 * @template Indexes - Your Elasticsearch index definitions
 * @template OnlyLeaf - If true, only returns leaf fields (excludes parent objects)
 * @template AllowVariants - If true, includes field variants (e.g., "field.keyword")
 *
 * @example
 * ```typescript
 * type Indexes = {
 *   "products": {
 *     info: {
 *       name: string;
 *       price: number;
 *     }
 *   }
 * };
 *
 * // PossibleFields<"products", Indexes> = "info" | "info.name" | "info.price"
 * // PossibleFields<"products", Indexes, true> = "info.name" | "info.price"
 * ```
 */
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

/**
 * Error type returned when a field cannot be used in an aggregation.
 *
 * This typically occurs when:
 * - The field doesn't exist in the index
 * - The field is a parent object, not a leaf field
 *
 * @example
 * ```typescript
 * // Error: Field 'invalid_field' cannot be used in aggregation on 'products'
 * // Suggestion: Use one of: "id" | "name" | "price" | ...
 * const query = typedEs(client, {
 *   index: "products",
 *   aggs: {
 *     my_agg: {
 *       terms: { field: "invalid_field" }  // Error here
 *     }
 *   }
 * });
 * ```
 */
export type InvalidFieldInAggregation<
	Field extends string,
	Index extends string,
	Aggregation,
> = {
	error: `Field '${Field}' cannot be used in aggregation on '${Index}'. Check that the field exists and is a leaf field (not a parent object).`;
	aggregation: Aggregation;
	hint: "Use PossibleFields<Index, Indexes, true> to see valid fields for aggregations";
};

/**
 * Error type returned when a field has the wrong type for an aggregation.
 *
 * @example
 * ```typescript
 * // Error: Field 'name' on index 'products' has type 'string' but aggregation requires 'number'
 * const query = typedEs(client, {
 *   index: "products",
 *   aggs: {
 *     avg_name: {
 *       avg: { field: "name" }  // Error: can't average strings
 *     }
 *   }
 * });
 * ```
 */
export type InvalidFieldTypeInAggregation<
	Field extends string,
	Index extends string,
	Aggregation,
	got,
	expected,
> = {
	error: `Field '${Field}' on index '${Index}' has type '${ToString<got>}' but aggregation requires '${ToString<expected>}'`;
	field: Field;
	aggregation: Aggregation;
	got: got;
	expected: expected;
	hint: "Check the field type in your index definition and ensure it matches the aggregation requirements";
};

/**
 * Error type returned when an aggregation property has the wrong type.
 *
 * @example
 * ```typescript
 * // Error: Property 'size' expects 'number' but got 'string'
 * const query = typedEs(client, {
 *   index: "products",
 *   aggs: {
 *     top_products: {
 *       terms: {
 *         field: "category",
 *         size: "10"  // Error: should be number, not string
 *       }
 *     }
 *   }
 * });
 * ```
 */
export type InvalidPropertyTypeInAggregation<
	PropertyName extends string,
	Aggregation,
	got,
	expected,
> = {
	error: `Property '${PropertyName}' has incorrect type`;
	aggregation: Aggregation;
	property: PropertyName;
	got: got;
	expected: expected;
	hint: "Check the aggregation configuration syntax in Elasticsearch documentation";
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
	| "adjacency_matrix"
	| "auto_date_histogram"
	| "boxplot"
	| "cartesian_centroid"
	| "categorize_text"
	| "children"
	| "date_histogram"
	| "date_range"
	| "extended_stats"
	| "filter"
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
	| "nested"
	| "median_absolute_deviation"
	| "percentile_ranks"
	| "percentiles"
	| "range"
	| "rate"
	| "sampler"
	| "scripted_metric"
	| "significant_text"
	| "stats"
	| "string_stats"
	| "terms"
	| "top_hits"
	| "top_metrics"
	| "variable_width_histogram"
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
			| AdjacencyMatrixAggs<BaseQuery, E, Index, Agg>
			| AutoDateHistogramAggs<BaseQuery, E, Index, Agg>
			| CategorizeTextAggs<BaseQuery, E, Index, Agg>
			| ChildrenAggs<BaseQuery, E, Index, Agg>
			| CompositeAggs<BaseQuery, E, Index, Agg>
			| DateHistogramAggs<BaseQuery, E, Index, Agg>
			| DateRangeAggs<BaseQuery, E, Index, Agg>
			| FilterAggs<BaseQuery, E, Index, Agg>
			| FiltersAggs<BaseQuery, E, Index, Agg>
			| GeoHashGridAggs<BaseQuery, E, Index, Agg>
			| GeoHexGridAggs<BaseQuery, E, Index, Agg>
			| GeoTileGridAggs<BaseQuery, E, Index, Agg>
			| HistogramAggs<BaseQuery, E, Index, Agg>
			| IpPrefixAggs<BaseQuery, E, Index, Agg>
			| IpRangeAggs<BaseQuery, E, Index, Agg>
			| NestedAggs<BaseQuery, E, Index, Agg>
			| RangeAggs<BaseQuery, E, Index, Agg>
			| SamplerAggs<BaseQuery, E, Index, Agg>
			| SignificantTextAggs<E, Index, Agg>
			| TermsAggs<BaseQuery, E, Index, Agg>
			| VariableWidthHistogramAggs<BaseQuery, E, Index, Agg>
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

/**
 * The base type for defining your Elasticsearch index mappings.
 *
 * Each key represents an index name, and its value is an object describing the document structure.
 *
 * @example
 * ```typescript
 * type MyIndexes = {
 *   "products": {
 *     id: number;
 *     name: string;
 *     price: number;
 *   };
 *   "orders": {
 *     order_id: string;
 *     product_id: number;
 *     quantity: number;
 *   };
 * };
 * ```
 */
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
	QueryWithSource extends Partial<SearchRequest>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Type extends "_source" | "fields",
	//
	RequestedFields = Type extends "_source"
		? ExtractQuery_Source<QueryWithSource, E, Index>
		: ExtractQueryFields<QueryWithSource>,
	// TODO: make this a union string instead of an object. we no longer need the values
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
	? DeepPickPaths<E[Index], Extract<keyof Output, string>>
	: {
			[K in keyof Output as Output[K] extends FLAT_UNKNOWN
				? RemoveLastDot<K>
				: K]: Output[K] extends FLAT_UNKNOWN
				? Array<unknown>
				: Array<Output[K]>;
		};

export type UsefulSearchRequestFields =
	| "_source"
	| "aggs"
	| "aggregations"
	| "docvalue_fields"
	| "fields"
	| "index"
	| "track_total_hits"
	| "rest_total_hits_as_int";

export type SearchRequest = Pick<
	estypes.SearchRequest,
	UsefulSearchRequestFields
>;

/**
 * A type-safe Elasticsearch search request that provides autocomplete and validation
 * for index names, _source fields, fields, and docvalue_fields.
 *
 * @template Indexes - Your Elasticsearch index definitions
 *
 * @remarks
 * This type extends the standard Elasticsearch SearchRequest but adds:
 * - Type-checked index names (must be a key in your Indexes type)
 * - Autocomplete for _source, fields, and docvalue_fields based on your index schema
 * - Support for wildcard patterns in field names
 * - Proper type inference for the search response
 *
 * @example
 * ```typescript
 * type MyIndexes = {
 *   "products": {
 *     id: number;
 *     name: string;
 *     price: number;
 *   }
 * };
 *
 * // Valid query
 * const query: TypedSearchRequest<MyIndexes> = {
 *   index: "products",
 *   _source: ["id", "name"],  // Autocomplete works here
 *   query: { match_all: {} }
 * };
 *
 * // Invalid query - TypeScript error
 * const invalid: TypedSearchRequest<MyIndexes> = {
 *   index: "invalid-index",  // Error: not in MyIndexes
 *   _source: ["invalid_field"]  // Error: field doesn't exist
 * };
 * ```
 */
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
