import type {
	AggregationOutput,
	ExtractAggs,
	NextAggsParentKey,
	RequestedIndex,
	SearchRequest,
} from "..";
import type { PrettyArray } from "../types/helpers";

export type DateHistogramAggs<
	Query extends SearchRequest,
	ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index = RequestedIndex<Query>,
> = ExtractAggs<Query>[Key] extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
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
