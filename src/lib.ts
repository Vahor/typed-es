import type { estypes } from "@elastic/elasticsearch";
import type * as Bucket from "./aggregations/bucket";
import type * as Metric from "./aggregations/metrics";
import type { AggFunction } from "./aggregations/metrics";
import type * as Pipeline from "./aggregations/pipeline";
import type {
	AnyString,
	DeepPickPaths,
	IsNever,
	IsOptional,
	IsStringLiteral,
	Optional,
	RArray,
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
type AllIndex = "_all";
export type ElasticsearchIndex<Indexes extends ElasticsearchIndexes> =
	| Extract<keyof Indexes, string>
	| AllIndex
	| RArray<Extract<keyof Indexes, string>>;

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
> = Index extends AllIndex
	? {
			[K in Extract<keyof Indexes, string>]: PossibleFields<
				K,
				Indexes,
				OnlyLeaf,
				AllowVariants
			>;
		}[Extract<keyof Indexes, string>]
	: Index extends keyof Indexes
		? AllowVariants extends true
			?
					| FilterToOnlyLeaf<
							WithVariants<JoinKeys<Indexes[Index], OnlyLeaf>>,
							Indexes,
							Extract<Index, string>
					  >
					| JoinKeys<Indexes[Index], OnlyLeaf>
			: JoinKeys<Indexes[Index], OnlyLeaf>
		: never;

export type CanBeUsedInAggregation<
	Field extends string,
	Index extends string,
	E extends ElasticsearchIndexes,
> =
	IsStringLiteral<Field> extends false
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
	Index extends string,
> = Index extends AllIndex
	? {
			[K in Extract<keyof Indexes, string>]: RecursiveDotNotation<
				Indexes[K],
				Field
			>;
		}[Extract<keyof Indexes, string>]
	: Index extends keyof Indexes
		? RecursiveDotNotation<Indexes[Index], Field>
		: never;

type RequestedIndexValue<Index> = Index extends string
	? Index
	: Index extends RArray<infer I extends string>
		? I
		: never;

export type RequestedIndex<Query> = "index" extends keyof Query
	? RequestedIndexValue<NonNullable<Query["index"]>>
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
	| "cartesian_bounds"
	| "cartesian_centroid"
	| "categorize_text"
	| "children"
	| "date_histogram"
	| "date_range"
	| "diversified_sampler"
	| "extended_stats"
	| "filter"
	| "filters"
	| "frequent_item_sets"
	| "geo_bounds"
	| "geo_centroid"
	| "geo_line"
	| "geohex_grid"
	| "geotile_grid"
	| "histogram"
	| "ip_prefix"
	| "ip_range"
	| "matrix_stats"
	| "global"
	| "missing"
	| "nested"
	| "median_absolute_deviation"
	| "parent"
	| "percentile_ranks"
	| "percentiles"
	| "range"
	| "rate"
	| "random_sampler"
	| "sampler"
	| "scripted_metric"
	| "significant_text"
	| "significant_terms"
	| "stats"
	| "string_stats"
	| "t_test"
	| "multi_terms"
	| "terms"
	| "rare_terms"
	| "top_hits"
	| "top_metrics"
	| "variable_width_histogram"
	| "reverse_nested"
	//
	| AggFunction
	// Pipeline
	| "avg_bucket"
	| "bucket_correlation"
	| "bucket_count_ks_test"
	| "bucket_script"
	| "cumulative_cardinality"
	| "cumulative_sum"
	| "derivative"
	| "stats_bucket"
	| "sum_bucket"
	| "min_bucket"
	| "max_bucket"
	| "extended_stats_bucket"
	| "inference"
	| "moving_fn"
	| "normalize"
	| "percentiles_bucket"
	| "moving_percentiles"
	| "serial_diff"
>;

export type AggregationOutput<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	CurrentAggregationKey extends keyof ExtractAggs<Query>,
	Index extends string = RequestedIndex<Query>,
	Agg = UnionToIntersection<ExtractAggs<Query>[CurrentAggregationKey]>,
> =
	IsNever<CurrentAggregationKey> extends true
		? never
		: // Bucket aggregations
				| Bucket.AdjacencyMatrix<BaseQuery, E, Index, Agg>
				| Bucket.AutoDateHistogram<BaseQuery, E, Index, Agg>
				| Bucket.CategorizeText<BaseQuery, E, Index, Agg>
				| Bucket.Children<BaseQuery, E, Index, Agg>
				| Bucket.Composite<BaseQuery, E, Index, Agg>
				| Bucket.DateHistogram<BaseQuery, E, Index, Agg>
				| Bucket.DateRange<BaseQuery, E, Index, Agg>
				| Bucket.DiversifiedSampler<BaseQuery, E, Index, Agg>
				| Bucket.Filter<BaseQuery, E, Index, Agg>
				| Bucket.Filters<BaseQuery, E, Index, Agg>
				| Bucket.FrequentItemSets<BaseQuery, E, Index, Agg>
				| Bucket.GeoHashGrid<BaseQuery, E, Index, Agg>
				| Bucket.GeoHexGrid<BaseQuery, E, Index, Agg>
				| Bucket.GeoTileGrid<BaseQuery, E, Index, Agg>
				| Bucket.Histogram<BaseQuery, E, Index, Agg>
				| Bucket.IpPrefix<BaseQuery, E, Index, Agg>
				| Bucket.IpRange<BaseQuery, E, Index, Agg>
				| Bucket.Parent<BaseQuery, E, Index, Agg>
				| Bucket.Global<BaseQuery, E, Index, Agg>
				| Bucket.Missing<BaseQuery, E, Index, Agg>
				| Bucket.Nested<BaseQuery, E, Index, Agg>
				| Bucket.Range<BaseQuery, E, Index, Agg>
				| Bucket.RandomSampler<BaseQuery, E, Index, Agg>
				| Bucket.Sampler<BaseQuery, E, Index, Agg>
				| Bucket.SignificantText<BaseQuery, E, Index, Agg>
				| Bucket.SignificantTerms<BaseQuery, E, Index, Agg>
				| Bucket.Terms<BaseQuery, E, Index, Agg>
				| Bucket.RareTerms<BaseQuery, E, Index, Agg>
				| Bucket.MultiTerms<BaseQuery, E, Index, Agg>
				| Bucket.VariableWidthHistogram<BaseQuery, E, Index, Agg>
				| Bucket.ReverseNested<BaseQuery, E, Index, Agg>
				// Metric aggregations
				| Metric.Boxplot<E, Index, Agg>
				| Metric.CartesianBounds<E, Index, Agg>
				| Metric.CartesianCentroid<E, Index, Agg>
				| Metric.ExtendedStats<E, Index, Agg>
				| Metric.Function<E, Index, Agg>
				| Metric.GeoBounds<E, Index, Agg>
				| Metric.GeoCentroid<E, Index, Agg>
				| Metric.GeoLine<E, Index, Agg>
				| Metric.MatrixStats<E, Index, Agg>
				| Metric.MedianAbsoluteDeviation<E, Index, Agg>
				| Metric.Percentiles<E, Index, Agg>
				| Metric.PercentileRanks<E, Index, Agg>
				| Metric.Rate<E, Index, Agg>
				| Metric.ScriptedMetric<Agg>
				| Metric.Stats<E, Index, Agg>
				| Metric.StringStats<E, Index, Agg>
				| Metric.TTest<E, Index, Agg>
				| Metric.TopHits<BaseQuery, E, Index, Agg>
				| Metric.TopMetrics<E, Index, Agg>
				| Metric.WeightedAvg<E, Index, Agg>
				// Pipeline aggregations
				| Pipeline.AvgBucket<Agg>
				| Pipeline.BucketCorrelation<Agg>
				| Pipeline.BucketCountKSTest<Agg>
				| Pipeline.BucketScript<Agg>
				| Pipeline.CumulativeCardinality<Agg>
				| Pipeline.CumulativeSum<Agg>
				| Pipeline.Derivative<Agg>
				| Pipeline.ExtendedStatsBucket<Agg>
				| Pipeline.Inference<Agg>
				| Pipeline.MaxBucket<Agg>
				| Pipeline.MinBucket<Agg>
				| Pipeline.MovingFunction<Agg>
				| Pipeline.MovingPercentiles<ExtractAggs<Query>, E, Index, Agg>
				| Pipeline.Normalize<Agg>
				| Pipeline.PercentilesBucket<Agg>
				| Pipeline.SerialDiff<Agg>
				| Pipeline.StatsBucket<Agg>
				| Pipeline.SumBucket<Agg>;

export type AppendSubAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
> =
	IsNever<NextAggsParentKey<Agg>> extends true
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

export type QueryTotal<Query extends SearchRequest> =
	HasOption<Query, "track_total_hits", false> extends true
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

type DeepPickFieldsForAllIndex<
	E extends ElasticsearchIndexes,
	Paths extends string,
> = {
	[K in Extract<keyof E, string>]: Extract<
		Paths,
		PossibleFields<K, E>
	> extends never
		? {}
		: DeepPickPaths<E[K], Extract<Paths, PossibleFields<K, E>>>;
}[Extract<keyof E, string>];

type DeepPickPathsForIndex<
	E extends ElasticsearchIndexes,
	Index extends string,
	Paths extends string,
> = Paths extends string
	? IsNever<TypeOfField<Paths, E, Index>> extends false
		? Paths
		: IsParentKeyALeaf<Paths, E, Index> extends true
			? Paths
			: never
	: never;

type DeepPickFieldsForIndex<
	E extends ElasticsearchIndexes,
	Index extends string,
	Paths extends string,
> = Index extends AllIndex
	? [Paths] extends [PossibleFields<Index, E>]
		? [PossibleFields<Index, E>] extends [Paths]
			? E[Extract<keyof E, string>]
			: DeepPickFieldsForAllIndex<E, Paths>
		: DeepPickFieldsForAllIndex<E, Paths>
	: Index extends keyof E
		? DeepPickPaths<E[Index], DeepPickPathsForIndex<E, Index, Paths>>
		: never;

export type ElasticsearchOutputFields<
	QueryWithSource extends Partial<SearchRequest>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Type extends "_source" | "fields",
	//
	RequestedFields = Type extends "_source"
		? ExtractQuery_Source<
				QueryWithSource,
				E,
				Index,
				Index extends keyof E ? keyof E[Index] : PossibleFields<Index, E>
			>
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
	? DeepPickFieldsForIndex<E, Index, Extract<keyof Output, string>>
	: {
			[K in keyof Output as Output[K] extends FLAT_UNKNOWN
				? RemoveLastDot<K>
				: K]: Output[K] extends FLAT_UNKNOWN
				? Array<unknown>
				: Array<Output[K]>;
		};

export type ExtractScriptFieldsKeys<Query extends SearchRequest> =
	Query extends {
		script_fields: infer S;
	}
		? S extends Record<string, { script: unknown }>
			? keyof S
			: never
		: never;

type RecursiveExtractHasChild<Q> =
	Q extends ReadonlyArray<infer I>
		? RecursiveExtractHasChild<I>
		: Q extends Record<string, unknown>
			? {
					[K in keyof Q]: K extends "has_child"
						? Q[K] extends {
								inner_hits: Optional<{ name: infer N extends string }>;
							}
							? { name: N; optional: IsOptional<Q[K]["inner_hits"]> }
							: Q[K] extends {
										inner_hits: Optional<unknown>;
										type: infer T extends string;
									}
								? { name: T; optional: IsOptional<Q[K]["inner_hits"]> }
								: never
						: RecursiveExtractHasChild<Q[K]>;
				}[keyof Q]
			: never;

export type ExtractHasChildInnerHitsKeys<Query extends SearchRequest> =
	Query extends { query: infer Q } ? RecursiveExtractHasChild<Q> : never;

export type InnerHitsQueryTotal<Query extends SearchRequest> =
	HasOption<Query, "rest_total_hits_as_int", true> extends true
		? number
		: estypes.SearchTotalHits;

/**
 * Fields that are updated by this lib.
 */
export type OverwrittenSearchRequestFields =
	| "_source"
	| "aggs"
	| "aggregations"
	| "docvalue_fields"
	| "script_fields"
	| "fields"
	| "index"
	| "track_total_hits"
	| "rest_total_hits_as_int"
	| "sort"
	| "query";

export type SearchRequest = Pick<
	estypes.SearchRequest,
	Exclude<OverwrittenSearchRequestFields, IssueWithReadonlyArray>
>;

/**
 * HACK: const Query modifier cause sort/query to be readonly. which cause issues with estypes versions as it has mutable arrays in types.
 * The correct fix would be to overrides these types but as we don't really have to, we simply skip them.
 */
type IssueWithReadonlyArray = "sort" | "query";

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
type TypedSearchRequestForIndex<
	Indexes extends ElasticsearchIndexes,
	Index extends string,
	IndexInput = Index,
> = {
	index: IndexInput;
	_source?:
		| RArray<PossibleFieldsWithWildcards<Index, Indexes>>
		| false
		| {
				includes?: RArray<PossibleFieldsWithWildcards<Index, Indexes>>;
				include?: RArray<PossibleFieldsWithWildcards<Index, Indexes>>;
				excludes?: RArray<PossibleFieldsWithWildcards<Index, Indexes>>;
				exclude?: RArray<PossibleFieldsWithWildcards<Index, Indexes>>;
		  };
	fields?: RArray<
		| PossibleFieldsWithWildcards<Index, Indexes, true>
		| {
				field: PossibleFieldsWithWildcards<Index, Indexes, true>;
				format?: string;
		  }
	>;
	docvalue_fields?: RArray<
		| PossibleFieldsWithWildcards<Index, Indexes, true>
		| {
				field: PossibleFieldsWithWildcards<Index, Indexes, true>;
				format?: string;
		  }
	>;
};

export type TypedSearchRequest<Indexes extends ElasticsearchIndexes> = Omit<
	estypes.SearchRequest,
	"index" | "_source" | "fields" | "docvalue_fields" | IssueWithReadonlyArray
> &
	(
		| {
				[K in Extract<keyof Indexes, string>]: TypedSearchRequestForIndex<
					Indexes,
					K
				>;
		  }[Extract<keyof Indexes, string>]
		| TypedSearchRequestForIndex<Indexes, AllIndex>
		| TypedSearchRequestForIndex<
				Indexes,
				Extract<keyof Indexes, string>,
				RArray<Extract<keyof Indexes, string>>
		  >
	);

export type ExtractAggs<V> = V extends
	| { aggs: infer A }
	| { aggregations: infer A }
	? A
	: never;
