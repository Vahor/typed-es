import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "../..";
import type {
	IsNever,
	KeyedArrayToObject,
	Prettify,
	ToDecimal,
	ToString,
} from "../../types/helpers";

type RangeSpec = {
	from?: number | undefined;
	to?: number | undefined;
};

type FormatToKey<N> = IsNever<ToDecimal<N>> extends false
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
				{
					key: K extends string ? K : `${FormatToKey<F>}-${FormatToKey<T>}`;
					doc_count: number;
				} & {
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
export type RangeAggs<
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
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? Ranges extends readonly RangeSpec[]
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
			: never
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
