import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type { KeyedArrayToObject, Prettify } from "../../types/helpers";
import type { AggregationFieldTypeResult, KeyedBucketBase } from "../helpers";

type RangeSpec = {
	from?: string | undefined;
	to?: string | undefined;
};

type FormatToKey<N> = undefined extends N ? "*" : string;

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
		key?: infer CustomKey;
	}
		? Prettify<
				KeyedBucketBase<
					undefined extends CustomKey
						? `${FormatToKey<F>}-${FormatToKey<T>}`
						: CustomKey
				> & {
					[K in "from" | "from_as_string" as F extends string
						? K
						: never]: K extends "from_as_string" ? string : number;
				} & {
					[K in "to" | "to_as_string" as T extends string
						? K
						: never]: K extends "to_as_string" ? string : number;
				}
			> &
				AppendSubAggs<BaseQuery, E, Index, Agg>
		: never;
};

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-daterange-aggregation
 */
export type DateRange<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	date_range: {
		field: infer Field extends string;
		keyed?: infer Keyed;
		ranges: infer Ranges;
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
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
