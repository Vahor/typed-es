import type {
	ElasticsearchIndexes,
	ElasticsearchOutputFields,
	QueryTotal,
	SearchRequest,
} from "../..";
import type { PrettyArray } from "../../types/helpers";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-hits-aggregation
export type TopHitsAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	top_hits: infer T extends Record<string, unknown>;
}
	? {
			hits: {
				total: QueryTotal<BaseQuery>;
				max_score: number | null;
				hits: PrettyArray<{
					_index: Index;
					_id: string;
					_source: ElasticsearchOutputFields<T, E, Index, "_source">;
					sort: Array<unknown>;
					_score: number | null;
				}>;
			};
		}
	: never;
