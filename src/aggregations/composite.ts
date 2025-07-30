import type {
	AggregationOutput,
	ExtractAggs,
	NextAggsParentKey,
	RequestedIndex,
	SearchRequest,
} from "..";
import type { PrettyArray } from "../types/helpers";

type CompositeSources = Array<Record<string, unknown>>;

type ExtractSourcesKeys<Sources extends CompositeSources> = {
	[k in keyof Sources]: keyof Sources[k];
}[number];

export type CompositeAggs<
	Query extends SearchRequest,
	ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = ExtractAggs<Query>[Key] extends {
	composite: { sources: infer Sources extends CompositeSources };
}
	? {
			after_key: Record<ExtractSourcesKeys<Sources>, unknown>;
			buckets: PrettyArray<
				{
					key: Record<ExtractSourcesKeys<Sources>, unknown>;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<ExtractAggs<Query>[Key]>]: AggregationOutput<
						ExtractAggs<Query>[Key],
						ElasticsearchIndexes,
						k,
						Index
					>;
				}
			>;
		}
	: never;
