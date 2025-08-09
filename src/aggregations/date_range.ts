import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";
import type { Prettify } from "../types/helpers";

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
				{
					key: undefined extends CustomKey
						? `${FormatToKey<F>}-${FormatToKey<T>}`
						: CustomKey;
					doc_count: number;
				} & {
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

type RangeOutputToObject<Ranges> = Ranges extends readonly { key: string }[]
	? {
			[K in Ranges[number] as K["key"]]: Omit<K, "key">;
		}
	: never;

export type DateRangeAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	date_range: {
		field: string;
		keyed?: infer Keyed;
		ranges: infer Ranges;
	};
}
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
	: never;
