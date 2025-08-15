import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type {
	CidrIpv4,
	CidrIpv6,
	Ipv4,
	Ipv6,
} from "../../../src/types/helpers";
import type { TestAggregationOutput } from "../../shared";

describe("IpPrefix Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				"ipv4-subnets": {
					ip_prefix: {
						field: "ip";
						prefix_length: 24;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"ipv4-subnets": {
				buckets: Array<{
					key: Ipv4;
					doc_count: number;
					is_ipv6: false;
					prefix_length: 24;
					netmask: Ipv4;
				}>;
			};
		}>();
	});

	test("with ipv6", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				"ipv6-subnets": {
					ip_prefix: {
						field: "ip";
						prefix_length: 64;
						is_ipv6: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"ipv6-subnets": {
				buckets: Array<{
					key: Ipv6;
					doc_count: number;
					is_ipv6: true;
					prefix_length: 64;
				}>;
			};
		}>();
	});

	test("appends prefix length", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				"ipv4-subnets": {
					ip_prefix: {
						field: "ip";
						prefix_length: 24;
						append_prefix_length: true;
					};
				};
				"ipv6-subnets": {
					ip_prefix: {
						field: "ip";
						prefix_length: 64;
						append_prefix_length: true;
						is_ipv6: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"ipv4-subnets": {
				buckets: Array<{
					key: CidrIpv4<24>;
					doc_count: number;
					is_ipv6: false;
					prefix_length: 24;
					netmask: Ipv4;
				}>;
			};
			"ipv6-subnets": {
				buckets: Array<{
					key: CidrIpv6<64>;
					doc_count: number;
					is_ipv6: true;
					prefix_length: 64;
				}>;
			};
		}>();
	});

	test("with keyed", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				"ipv4-subnets": {
					ip_prefix: {
						field: "ip";
						prefix_length: 24;
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"ipv4-subnets": {
				buckets: Record<
					Ipv4,
					{
						is_ipv6: false;
						prefix_length: 24;
						netmask: Ipv4;
						doc_count: number;
					}
				>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					ip_prefix: {
						field: "invalid";
						prefix_length: 24;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_ranges: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["price_ranges"]
			>;
		}>();
	});

	test("fails when using an invalid type field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					ip_prefix: {
						field: "score";
						prefix_length: 24;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_ranges: InvalidFieldTypeInAggregation<
				"score",
				"demo",
				Aggregations["input"]["price_ranges"],
				number,
				string
			>;
		}>();
	});

	test("supports nested sub-aggregations in buckets", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				with_sub: {
					ip_prefix: {
						field: "shipping_address.geo_point";
						prefix_length: 24;
					};
					aggs: {
						by_status: { terms: { field: "status" } };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			with_sub: {
				buckets: Array<{
					key: Ipv4;
					doc_count: number;
					is_ipv6: false;
					prefix_length: 24;
					netmask: Ipv4;
					by_status: {
						doc_count_error_upper_bound: number;
						sum_other_doc_count: number;
						buckets: Array<{
							key: "pending" | "completed" | "cancelled";
							doc_count: number;
						}>;
					};
				}>;
			};
		}>();
	});
});
