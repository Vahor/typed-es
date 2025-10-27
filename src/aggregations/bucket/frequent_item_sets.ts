import type {
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
	TypeOfField,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-frequent-item-sets-aggregation
 */
export type FrequentItemSetsAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	frequent_item_sets: {
		fields: infer Fields extends Array<{ field: string }>;
	};
}
	? {
			buckets: PrettyArray<
				{
					key: {
						[K in Fields[number]["field"]]: TypeOfField<K, E, Index>[];
					};
					doc_count: number;
					support: number;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>;
		}
	: never;
