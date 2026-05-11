import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type {
	IsNever,
	KeyedArrayToObject,
	Prettify,
	ToDecimal,
	ToString,
} from "../../types/helpers";
import type { AggregationFieldTypeResult, KeyedBucketBase } from "../helpers";

type RangeSpec = {
	from?: number | undefined;
	to?: number | undefined;
};

type FormatToKey<N> =
	IsNever<ToDecimal<N>> extends false
		? ToDecimal<N>
		: undefined extends N
			? "*"
			: ToString<N>;

type RangeOutput<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
	Ranges extends readonly RangeSpec[],
> = {
	[index in keyof Ranges]: Ranges[index] extends {
		from?: infer F;
		to?: infer T;
		key?: infer K;
	}
		? Prettify<
				KeyedBucketBase<
					K extends string ? K : `${FormatToKey<F>}-${FormatToKey<T>}`
				> & {
					[K in "from" as F extends number ? K : never]: F;
				} & {
					[K in "to" as T extends number ? K : never]: T;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>
		: never;
};

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation
 */
export type Range<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	range: {
		field: infer Field extends string;
		keyed?: infer Keyed;
		ranges: infer Ranges;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			number,
			Ranges extends readonly RangeSpec[]
				? Keyed extends true
					? {
							buckets: KeyedArrayToObject<
								RangeOutput<BaseQuery, E, Index, Agg, Ranges>
							>;
						}
					: {
							// array default (keyed: false)
							buckets: RangeOutput<BaseQuery, E, Index, Agg, Ranges>;
						}
				: never,
			Field
		>
	: never;
