import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	SearchRequest,
} from "../..";
import type {
	IsNever,
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
	}
		? Prettify<
				{
					key: `${FormatToKey<F>}-${FormatToKey<T>}`;
					doc_count: number;
				} & {
					[K in "from" as F extends number ? K : never]: F;
				} & {
					[K in "to" as T extends number ? K : never]: T;
				}
			> &
				AppendSubAggs<BaseQuery, E, Index, Agg>
		: never;
};

type RangeOutputToObject<Ranges> = Ranges extends readonly { key: string }[]
	? {
			[K in Ranges[number] as K["key"]]: Omit<K, "key">;
		}
	: never;

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation
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
						buckets: RangeOutputToObject<
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
