import type {
	AppendSubAggs,
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	SearchRequest,
	TypeOfField,
} from "../..";
import type {
	CidrIpv4,
	CidrIpv6,
	Ipv4,
	Ipv6,
	IsSomeSortOf,
	KeyedArrayToObject,
	PrettyArray,
} from "../../types/helpers";

type IpPrefixOutput<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg extends Record<string, unknown>,
	//
	AppendPrefixLength,
	PrefixLength extends number,
	IsIpv6,
> = PrettyArray<
	{
		key: AppendPrefixLength extends true
			? IsIpv6 extends true
				? CidrIpv6<PrefixLength>
				: CidrIpv4<PrefixLength>
			: IsIpv6 extends true
				? Ipv6
				: Ipv4;
		doc_count: number;
		is_ipv6: IsIpv6 extends true ? true : false;
		prefix_length: PrefixLength;
	} & {
		[K in "netmask" as IsIpv6 extends true ? never : K]: Ipv4;
	} & AppendSubAggs<BaseQuery, E, Index, Agg>
>;

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-ipprefix-aggregation
export type IpPrefixAggs<
	BaseQuery extends SearchRequest,
	E extends ElasticsearchIndexes,
	Index extends string,
	Agg,
> = Agg extends {
	ip_prefix: {
		field: infer Field extends string;
		prefix_length: infer PrefixLength extends number;
		is_ipv6?: infer IsIpv6; // default: false
		keyed?: infer Keyed; // default: false
		append_prefix_length?: infer AppendPrefixLength; // default: false
	};
}
	? CanBeUsedInAggregation<Field, Index, E> extends true
		? IsSomeSortOf<TypeOfField<Field, E, Index>, string> extends true
			? Keyed extends true
				? {
						buckets: KeyedArrayToObject<
							IpPrefixOutput<
								BaseQuery,
								E,
								Index,
								Agg,
								AppendPrefixLength,
								PrefixLength,
								IsIpv6
							>
						>;
					}
				: {
						// array default (keyed: false)
						buckets: IpPrefixOutput<
							BaseQuery,
							E,
							Index,
							Agg,
							AppendPrefixLength,
							PrefixLength,
							IsIpv6
						>;
					}
			: InvalidFieldTypeInAggregation<
					Field,
					Index,
					Agg,
					TypeOfField<Field, E, Index>,
					string
				>
		: InvalidFieldInAggregation<Field, Index, Agg>
	: never;
