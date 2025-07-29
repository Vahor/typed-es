import type {
	AggregationOutput,
	ExtractAggs,
	NextAggsParentKey,
	PrettyArray,
	RequestedIndex,
	SearchRequest,
} from "..";

export type CompositeAggs<
	Query extends SearchRequest,
	ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = ExtractAggs<Query>[Key] extends { composite: unknown }
	? {
			after_key: Record<string, unknown>;
			buckets: PrettyArray<
				{
					key: Record<string, unknown>;
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
