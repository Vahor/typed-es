import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	InvalidPropertyTypeInAggregation,
	SearchRequest,
	TypeOfField,
} from "../..";
import type {
	AtLeastOneOf,
	IsSomeSortOf,
	KeyedArrayToObject,
	Prettify,
} from "../../types/helpers";

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
				{
					key: K extends string
						? K
						: M extends string
							? M
							: `${FormatToKey<F>}-${FormatToKey<T>}`;
					doc_count: number;
				} & {
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

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-iprange-aggregation
export type IpRangeAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	ip_range: {
		field: infer Field extends string;
		keyed?: infer Keyed;
		ranges: infer Ranges;
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, string> extends true
			? Ranges extends readonly IpRangeSpec[]
				? Keyed extends true
					? {
							buckets: KeyedArrayToObject<
								IpRangeOutput<BaseQuery, E, Index, Agg, Ranges>
							>;
						}
					: {
							// array default (keyed: false)
							buckets: IpRangeOutput<BaseQuery, E, Index, Agg, Ranges>;
						}
				: InvalidPropertyTypeInAggregation<
						"ranges",
						Agg,
						Ranges,
						Array<IpRangeSpec>
					>
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					string
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
