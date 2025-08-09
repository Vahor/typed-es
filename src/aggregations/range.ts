import type { AppendSubAggs, ElasticsearchIndexes, SearchRequest } from "..";
import type {
	IsFloatLiteral,
	IsNumericLiteral,
	Prettify,
} from "../types/helpers";

type RangeSpec = {
	from?: number | undefined;
	to?: number | undefined;
};

type ToString<T> = T extends number ? `${T}` : string;

type FormatToKey<N> = IsFloatLiteral<N> extends true
	? ToString<N>
	: IsNumericLiteral<N> extends true
		? `${ToString<N>}.0`
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

export type RangeAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	range: {
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
