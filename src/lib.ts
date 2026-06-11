import type { estypes } from "@elastic/elasticsearch";
import type * as Bucket from "./aggregations/bucket";
import type * as Metric from "./aggregations/metrics";
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
	JoinKeys,
	Primitive,
	RecursiveDotNotation,
	RemoveLastDot,
} from "./types/object-to-dot-notation";
import type {
	FieldsOutputForSchema,
	MergeFieldsOutputEntries,
} from "./types/output-fields";
import type {
	ExtractQueryFields,
	ExtractQuerySource,
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

export type {
	InvalidSourceField,
	ValidateTypedSearchRequest,
} from "./types/source-validation";

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

type KeysOfUnion<T> = T extends unknown ? keyof T : never;

type ObjectKeysWithSpecificKeys<T, TargetKeys extends string> = {
	[k in keyof T]: T[k] extends Record<string, unknown>
		? Extract<KeysOfUnion<T[k]>, TargetKeys> extends never
			? never
			: k
		: never;
}[keyof T];

export type NextAggsParentKey<
	Query extends Record<string, unknown>,
	Aggs = ExtractAggs<Query>,
	Outputs = AggregationOutputMap<
		SearchRequest,
		Query,
		ElasticsearchIndexes,
		string,
		never
	>,
> = ObjectKeysWithSpecificKeys<Aggs, keyof Outputs & string>;

type AggregationOutputMap<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = {
	// Only aggregations that add entries to the response belong here.
	// Bucket aggregations
	adjacency_matrix: Bucket.AdjacencyMatrix<BaseQuery, E, Index, Agg>;
	auto_date_histogram: Bucket.AutoDateHistogram<BaseQuery, E, Index, Agg>;
	categorize_text: Bucket.CategorizeText<BaseQuery, E, Index, Agg>;
	children: Bucket.Children<BaseQuery, E, Index, Agg>;
	composite: Bucket.Composite<BaseQuery, E, Index, Agg>;
	date_histogram: Bucket.DateHistogram<BaseQuery, E, Index, Agg>;
	date_range: Bucket.DateRange<BaseQuery, E, Index, Agg>;
	diversified_sampler: Bucket.DiversifiedSampler<BaseQuery, E, Index, Agg>;
	filter: Bucket.Filter<BaseQuery, E, Index, Agg>;
	filters: Bucket.Filters<BaseQuery, E, Index, Agg>;
	frequent_item_sets: Bucket.FrequentItemSets<BaseQuery, E, Index, Agg>;
	geohash_grid: Bucket.GeoHashGrid<BaseQuery, E, Index, Agg>;
	geohex_grid: Bucket.GeoHexGrid<BaseQuery, E, Index, Agg>;
	geotile_grid: Bucket.GeoTileGrid<BaseQuery, E, Index, Agg>;
	histogram: Bucket.Histogram<BaseQuery, E, Index, Agg>;
	ip_prefix: Bucket.IpPrefix<BaseQuery, E, Index, Agg>;
	ip_range: Bucket.IpRange<BaseQuery, E, Index, Agg>;
	parent: Bucket.Parent<BaseQuery, E, Index, Agg>;
	global: Bucket.Global<BaseQuery, E, Index, Agg>;
	missing: Bucket.Missing<BaseQuery, E, Index, Agg>;
	nested: Bucket.Nested<BaseQuery, E, Index, Agg>;
	range: Bucket.Range<BaseQuery, E, Index, Agg>;
	random_sampler: Bucket.RandomSampler<BaseQuery, E, Index, Agg>;
	sampler: Bucket.Sampler<BaseQuery, E, Index, Agg>;
	significant_text: Bucket.SignificantText<BaseQuery, E, Index, Agg>;
	significant_terms: Bucket.SignificantTerms<BaseQuery, E, Index, Agg>;
	terms: Bucket.Terms<BaseQuery, E, Index, Agg>;
	time_series: Bucket.TimeSeries<BaseQuery, E, Index, Agg>;
	rare_terms: Bucket.RareTerms<BaseQuery, E, Index, Agg>;
	multi_terms: Bucket.MultiTerms<BaseQuery, E, Index, Agg>;
	variable_width_histogram: Bucket.VariableWidthHistogram<
		BaseQuery,
		E,
		Index,
		Agg
	>;
	reverse_nested: Bucket.ReverseNested<BaseQuery, E, Index, Agg>;
	// Metric aggregations
	boxplot: Metric.Boxplot<E, Index, Agg>;
	cartesian_bounds: Metric.CartesianBounds<E, Index, Agg>;
	cartesian_centroid: Metric.CartesianCentroid<E, Index, Agg>;
	extended_stats: Metric.ExtendedStats<E, Index, Agg>;
	value_count: Metric.Function<E, Index, Agg>;
	cardinality: Metric.Function<E, Index, Agg>;
	sum: Metric.Function<E, Index, Agg>;
	avg: Metric.Function<E, Index, Agg>;
	max: Metric.Function<E, Index, Agg>;
	min: Metric.Function<E, Index, Agg>;
	geo_bounds: Metric.GeoBounds<E, Index, Agg>;
	geo_centroid: Metric.GeoCentroid<E, Index, Agg>;
	geo_line: Metric.GeoLine<E, Index, Agg>;
	matrix_stats: Metric.MatrixStats<E, Index, Agg>;
	median_absolute_deviation: Metric.MedianAbsoluteDeviation<E, Index, Agg>;
	percentiles: Metric.Percentiles<E, Index, Agg>;
	percentile_ranks: Metric.PercentileRanks<E, Index, Agg>;
	rate: Metric.Rate<E, Index, Agg>;
	scripted_metric: Metric.ScriptedMetric<Agg>;
	stats: Metric.Stats<E, Index, Agg>;
	string_stats: Metric.StringStats<E, Index, Agg>;
	t_test: Metric.TTest<E, Index, Agg>;
	top_hits: Metric.TopHits<BaseQuery, E, Index, Agg>;
	top_metrics: Metric.TopMetrics<E, Index, Agg>;
	weighted_avg: Metric.WeightedAvg<E, Index, Agg>;
	// Pipeline aggregations
	avg_bucket: Pipeline.AvgBucket<Agg>;
	bucket_correlation: Pipeline.BucketCorrelation<Agg>;
	bucket_count_ks_test: Pipeline.BucketCountKSTest<Agg>;
	bucket_script: Pipeline.BucketScript<Agg>;
	change_point: Pipeline.ChangePoint<BaseQuery, Query, E, Index, Agg>;
	cumulative_cardinality: Pipeline.CumulativeCardinality<Agg>;
	cumulative_sum: Pipeline.CumulativeSum<Agg>;
	derivative: Pipeline.Derivative<Agg>;
	extended_stats_bucket: Pipeline.ExtendedStatsBucket<Agg>;
	inference: Pipeline.Inference<Agg>;
	max_bucket: Pipeline.MaxBucket<Agg>;
	min_bucket: Pipeline.MinBucket<Agg>;
	moving_fn: Pipeline.MovingFunction<Agg>;
	moving_percentiles: Pipeline.MovingPercentiles<
		ExtractAggs<Query>,
		E,
		Index,
		Agg
	>;
	normalize: Pipeline.Normalize<Agg>;
	percentiles_bucket: Pipeline.PercentilesBucket<Agg>;
	serial_diff: Pipeline.SerialDiff<Agg>;
	stats_bucket: Pipeline.StatsBucket<Agg>;
	sum_bucket: Pipeline.SumBucket<Agg>;
};

export type AggregationOutput<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	CurrentAggregationKey extends keyof ExtractAggs<Query>,
	Index extends string = RequestedIndex<Query>,
	Agg = UnionToIntersection<ExtractAggs<Query>[CurrentAggregationKey]>,
	Outputs = AggregationOutputMap<BaseQuery, Query, E, Index, Agg>,
	Key extends keyof Outputs = Extract<keyof Agg, keyof Outputs>,
> = IsNever<CurrentAggregationKey> extends true ? never : Outputs[Key];

export type AggregationOutputs<
	BaseQuery extends SearchRequest,
	Query extends Record<string, unknown>,
	E extends ElasticsearchIndexes,
	Index extends string = RequestedIndex<Query>,
> =
	IsNever<ExtractAggs<Query>> extends true
		? never
		: {
				[K in Extract<keyof ExtractAggs<Query>, string>]: AggregationOutput<
					BaseQuery,
					Query,
					E,
					K,
					Index
				>;
			};

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

type FieldVariantFields<
	E extends ElasticsearchIndexes,
	Index extends string,
	PossibleFieldPaths,
	RequestedFields,
> =
	InverseWildcardSearch<PossibleFieldPaths, RequestedFields> extends infer Field
		? Field extends string
			? IsParentKeyALeaf<Field, E, Index> extends true
				? Field
				: never
			: never
		: never;

type FieldsOutputForIndex<
	E extends ElasticsearchIndexes,
	Index extends string,
	Field extends string,
	Value,
> = Index extends AllIndex
	? {
			[K in Extract<keyof E, string>]: FieldsOutputForSchema<
				E[K],
				Field,
				Value
			>;
		}[Extract<keyof E, string>]
	: Index extends keyof E
		? FieldsOutputForSchema<E[Index], Field, Value>
		: Record<Field, Value>;

type FieldsOutputEntry<
	E extends ElasticsearchIndexes,
	Index extends string,
	Field extends string,
	VariantFields,
> = Field extends VariantFields
	? RemoveLastDot<Field> extends infer BaseField extends string
		? FieldsOutputForIndex<E, Index, BaseField, unknown[]>
		: never
	: FieldsOutputForIndex<E, Index, Field, Array<TypeOfField<Field, E, Index>>>;

type ElasticsearchFieldsResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	OutputFields,
	VariantFields,
	Field extends string = Extract<OutputFields, string>,
> =
	IsNever<Field> extends true
		? {}
		: MergeFieldsOutputEntries<
				Field extends string
					? FieldsOutputEntry<E, Index, Field, VariantFields>
					: never
			>;

export type ElasticsearchOutputFields<
	QueryWithSource extends Partial<SearchRequest>,
	E extends ElasticsearchIndexes,
	Index extends string,
	Type extends "_source" | "fields",
	//
	RequestedFields = Type extends "_source"
		? ExtractQuerySource<
				QueryWithSource,
				E,
				Index,
				Index extends keyof E ? keyof E[Index] : PossibleFields<Index, E>
			>
		: ExtractQueryFields<QueryWithSource>,
	PossibleFieldPaths = PossibleFields<
		Index,
		E,
		Type extends "fields" ? true : false
	>,
	MatchedFields = WildcardSearch<PossibleFieldPaths, RequestedFields>,
	// Elasticsearch accepts variant names like `field.keyword`; keep them when the base `field` exists as a leaf.
	VariantFields = FieldVariantFields<
		E,
		Index,
		PossibleFieldPaths,
		RequestedFields
	>,
	OutputFields = MatchedFields | VariantFields,
> = Type extends "_source"
	? DeepPickFieldsForIndex<E, Index, Extract<OutputFields, string>>
	: ElasticsearchFieldsResult<E, Index, OutputFields, VariantFields>;

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

type SearchSourceRequest<Field extends string> =
	| RArray<Field>
	| false
	| {
			includes?: RArray<Field>;
			include?: RArray<Field>;
			excludes?: RArray<Field>;
			exclude?: RArray<Field>;
	  };

type SearchFieldsRequest<Field extends string> = RArray<
	| Field
	| {
			field: Field;
			format?: string;
	  }
>;

export type SearchRequest = Pick<
	estypes.SearchRequest,
	Exclude<OverwrittenSearchRequestFields, IssueWithReadonlyArray>
> & {
	index?: estypes.SearchRequest["index"] | RArray<string>;
	_source?: estypes.SearchRequest["_source"] | SearchSourceRequest<string>;
	fields?: estypes.SearchRequest["fields"] | SearchFieldsRequest<string>;
	docvalue_fields?:
		| estypes.SearchRequest["docvalue_fields"]
		| SearchFieldsRequest<string>;
};

/**
 * HACK: const Query modifier cause some search options to be readonly. which cause issues with estypes versions as it has mutable arrays in types.
 * The correct fix would be to override these types but as we don't really have to, we simply skip them.
 */
type IssueWithReadonlyArray =
	| "sort"
	| "query"
	| "index"
	| "_source"
	| "fields"
	| "docvalue_fields";

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
	_source?: SearchSourceRequest<PossibleFieldsWithWildcards<Index, Indexes>>;
	fields?: SearchFieldsRequest<
		PossibleFieldsWithWildcards<Index, Indexes, true>
	>;
	docvalue_fields?: SearchFieldsRequest<
		PossibleFieldsWithWildcards<Index, Indexes, true>
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
