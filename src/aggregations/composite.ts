import type {
	AggregationOutput,
	ElasticsearchIndexes,
	ExtractAggs,
	NextAggsParentKey,
	SearchRequest,
} from "..";
import type { PrettyArray, UnionToIntersection } from "../types/helpers";

type CompositeSources = Array<Record<string, unknown>>;

type ExtractSourcesKeys<Sources extends CompositeSources> = {
	[k in keyof Sources]: keyof Sources[k];
}[number];

export type CompositeAggs<
	BaseQuery extends SearchRequest,
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index extends string,
	Agg = UnionToIntersection<ExtractAggs<Query>[Key]>,
> = Agg extends {
	composite: { sources: infer Sources extends CompositeSources };
}
	? {
			after_key: Record<ExtractSourcesKeys<Sources>, unknown>;
			buckets: PrettyArray<
				{
					key: Record<ExtractSourcesKeys<Sources>, unknown>;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<Agg>]: AggregationOutput<
						BaseQuery,
						Agg,
						E,
						k,
						Index
					>;
				}
			>;
		}
	: never;
