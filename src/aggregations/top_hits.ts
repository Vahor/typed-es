import type {
	ElasticsearchIndexes,
	ElasticsearchOutputFields,
	ExtractAggs,
	QueryTotal,
	SearchRequest,
} from "..";
import type { PrettyArray } from "../types/helpers";

export type TopHitsAggs<
	BaseQuery extends SearchRequest,
	Query extends SearchRequest,
	E extends ElasticsearchIndexes,
	Key extends keyof ExtractAggs<Query>,
	Index extends string,
> = ExtractAggs<Query>[Key] extends {
	top_hits: infer T extends Record<string, unknown>;
}
	? {
			hits: PrettyArray<{
				total: QueryTotal<BaseQuery>;
				max_score: number | null;
				hits: PrettyArray<{
					_index: Index;
					_id: string;
					_source: ElasticsearchOutputFields<T, E, Index>;
					sort: Array<unknown>;
					_score: number | null;
				}>;
			}>;
		}
	: never;
