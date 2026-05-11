import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "../..";
import type {
	AtLeastOneOf,
	KeyedArrayToObject,
	Prettify,
} from "../../types/helpers";
import type { AggregationFieldTypeResult, KeyedBucketBase } from "../helpers";

type IpRangeSpec =
	| AtLeastOneOf<
			{
				from?: string;
				to?: string;
				key?: string;
			},
			"from" | "to"
	  >
	| {
			mask: string;
			key?: string;
	  };

type FormatToKey<S> = S extends string ? S : undefined extends S ? "*" : never;

type IpRangeOutput<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
	Ranges extends readonly IpRangeSpec[],
> = {
	[index in keyof Ranges]: Ranges[index] extends {
		from?: infer F;
		to?: infer T;
		mask?: infer M;
		key?: infer K;
	}
		? Prettify<
				KeyedBucketBase<
					K extends string
						? K
						: M extends string
							? M
							: `${FormatToKey<F>}-${FormatToKey<T>}`
				> & {
					[K in "from" as F extends string
						? K
						: M extends string
							? K
							: never]: M extends string ? string : F;
				} & {
					[K in "to" as T extends string
						? K
						: M extends string
							? K
							: never]: M extends string ? string : T;
				} & AppendSubAggs<BaseQuery, E, Index, Agg>
			>
		: never;
};

/**
 * @see https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-iprange-aggregation
 */
export type IpRange<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	ip_range: {
		field: infer Field extends string;
		keyed?: infer Keyed;
		ranges: infer Ranges extends readonly IpRangeSpec[];
	};
}
	? AggregationFieldTypeResult<
			E,
			Index,
			Agg,
			string,
			Keyed extends true
				? {
						buckets: KeyedArrayToObject<
							IpRangeOutput<BaseQuery, E, Index, Agg, Ranges>
						>;
					}
				: {
						// array default (keyed: false)
						buckets: IpRangeOutput<BaseQuery, E, Index, Agg, Ranges>;
					},
			Field
		>
	: never;
