import type {
	AppendSubAggs,
	ElasticsearchIndexes,
	SearchRequest,
	TypeOfField,
} from "../../";
import type { PrettyArray, SeparatedString } from "../../types/helpers";
import type { AggregationFieldResult, KeyedBucketBase } from "../helpers";

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-multi-terms-aggregation
 */
export type MultiTerms<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	multi_terms: { terms: infer Terms extends Array<object> };
}
	? Terms extends { field: infer Field extends string }[]
		? AggregationFieldResult<
				E,
				Index,
				Agg,
				{
					doc_count_error_upper_bound: number;
					sum_other_doc_count: number;
					buckets: PrettyArray<
						KeyedBucketBase<Array<TypeOfField<Field, E, Index>>> & {
							key_as_string: SeparatedString<"|", Terms["length"]>;
						} & AppendSubAggs<BaseQuery, E, Index, Agg>
					>;
				},
				Field
			>
		: never
	: never;
