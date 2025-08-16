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
	} & {
		"~type": "TypedSearchResponse";
	}
>;

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
					// @ts-expect-error: Query is BaseQuery not Record<string, unknown> but we know it
					Query,
					E,
					K,
					Index
				>;
			}
		>
	: `Index '${Index}' not found`;
