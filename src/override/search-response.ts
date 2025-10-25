import type { estypes } from "@elastic/elasticsearch";
import type {
	AggregationOutput,
	ElasticsearchIndexes,
	ElasticsearchOutputFields,
	ExtractAggs,
	ExtractAggsKey,
	QueryTotal,
	RequestedIndex,
	SearchRequest,
} from "../lib";
import type { IsNever, Prettify, UnionToIntersection } from "../types/helpers";

/**
 * Internal helper type that overrides the runtime Search Response
 * to provide a strongly-typed `hits` and `aggregations` payloads based on the
 * input query types.
 *
 * This preserves the rest of the runtime shape via `Omit<estypes.SearchResponse<T_Doc, T_Aggs>, "hits" | "aggregations">` and applies
 * the tailored `hits` and `aggregations` typings.
 *
 * @template Query - The input query type
 * @template T_Source - Output type for _source
 * @template T_Fields - Output type for fields
 * @template T_Aggs - Output type for aggregations
 * @template T_Doc - Combined doc type (source|fields)
 */
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
					"_source" | "fields" | "sort"
				> & {
					_source: Query["_source"] extends false ? undefined : T_Source;
					fields: "fields" extends keyof Query
						? T_Fields
						: "docvalue_fields" extends keyof Query
							? T_Fields
							: undefined;
					sort: "sort" extends keyof Query ? estypes.SortResults : undefined;
				}
			>;
		};
	} & {
		aggregations: IsNever<ExtractAggs<Query>> extends true
			? undefined
			: NonNullable<T_Aggs>;
	} & {
		"~type": "TypedSearchResponse";
	}
>;

/**
 * @template Query - The input query type
 * @template E - Elasticsearch index map
 * @template Index - The index string (defaulted via RequestedIndex<Query>)
 */
export type TypedSearchResponse<
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
					Query,
					E,
					// @ts-expect-error: TODO
					K,
					Index
				>;
			}
		>
	: `Index '${Index}' not found`;
