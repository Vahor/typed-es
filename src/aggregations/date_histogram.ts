import type {
	AggregationOutput,
	ElasticsearchIndexes,
	NextAggsParentKey,
	SearchRequest,
} from "..";
import type { PrettyArray } from "../types/helpers";

export type DateHistogramAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { date_histogram: unknown }
	? {
			buckets: PrettyArray<
				{
					key_as_string: string;
					key: unknown;
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
