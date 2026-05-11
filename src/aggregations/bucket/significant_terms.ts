import type {
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
} from "../../";
import type { Prettify, PrettyArray } from "../../types/helpers";
import type {
	AggregationFieldTypeResult,
	BucketBase,
	KeyedBucketBase,
} from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation
 */
export type SignificantTerms<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends { significant_terms: { field: infer Field extends string } }
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			Prettify<
				BucketBase & {
					bg_count: number;
					buckets: PrettyArray<
						KeyedBucketBase<string> & {
							score: number;
							bg_count: number;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				}
			>,
			Field
		>
	: never;
