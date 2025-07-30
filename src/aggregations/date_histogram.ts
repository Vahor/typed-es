import type {
	AggregationOutput,
	ElasticsearchIndexes,
	ExtractAggs,
	NextAggsParentKey,
	SearchRequest,
} from "..";
import type { PrettyArray } from "../types/helpers";

export type DateHistogramAggs<
	BaseQuery extends SearchRequest,
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index extends string,
> = ExtractAggs<Query>[Key] extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
					doc_count: number;
				} & {
					[k in NextAggsParentKey<ExtractAggs<Query>[Key]>]: AggregationOutput<
						BaseQuery,
						ExtractAggs<Query>[Key],
						E,
						k,
						Index
					>;
				}
			>;
		}
	: never;
