import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("IpRange Aggregations", () => {
	test("with from-to", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ip_ranges: {
					ip_range: {
						field: "ip";
						ranges: [{ to: string }, { from: string }];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ip_ranges: {
				buckets: [
					{
						key: `*-${string}`;
						to: string;
						doc_count: number;
					},
					{
						key: `${string}-*`;
						from: string;
						doc_count: number;
					},
				];
			};
		}>();
	});

	test("with explicit from-to", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ip_ranges: {
					ip_range: {
						field: "ip";
						ranges: [
							{ to: "10.0.0.5" },
							{ from: "10.0.0.5"; to: "10.0.0.255" },
							{ from: "10.0.0.255" },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ip_ranges: {
				buckets: [
					{
						key: "*-10.0.0.5";
						to: "10.0.0.5";
						doc_count: number;
					},
					{
						key: "10.0.0.5-10.0.0.255";
						from: "10.0.0.5";
						to: "10.0.0.255";
						doc_count: number;
					},
					{
						key: "10.0.0.255-*";
						from: "10.0.0.255";
						doc_count: number;
					},
				];
			};
		}>();
	});

	test("with cidr masks", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ip_ranges: {
					ip_range: {
						field: "ip";
						ranges: [{ mask: "10.0.0.0/25" }, { mask: "10.0.0.127/25" }];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ip_ranges: {
				buckets: [
					{
						key: "10.0.0.0/25";
						from: string;
						to: string;
						doc_count: number;
					},
					{
						key: "10.0.0.127/25";
						from: string;
						to: string;
						doc_count: number;
					},
				];
			};
		}>();
	});

	test("with keyed", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ip_ranges: {
					ip_range: {
						field: "ip";
						ranges: [{ to: "10.0.0.5" }, { from: "10.0.0.5" }];
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ip_ranges: {
				buckets: {
					"*-10.0.0.5": {
						to: "10.0.0.5";
						doc_count: number;
					};
					"10.0.0.5-*": {
						from: "10.0.0.5";
						doc_count: number;
					};
				};
			};
		}>();
	});
	test("with keyed and custom key", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ip_ranges: {
					ip_range: {
						field: "ip";
						ranges: [
							{ key: "infinity"; to: "10.0.0.5" },
							{ key: "and-beyond"; from: "10.0.0.5" },
						];
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ip_ranges: {
				buckets: {
					infinity: {
						to: "10.0.0.5";
						doc_count: number;
					};
					"and-beyond": {
						from: "10.0.0.5";
						doc_count: number;
					};
				};
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					ip_range: {
						field: "invalid";
						keyed: true;
						ranges: [{ to: "10.0.0.5" }, { from: "10.0.0.5" }];
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
					ip_range: {
						field: "score";
						keyed: true;
						ranges: [{ to: "10.0.0.5" }, { from: "10.0.0.5" }];
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
					ip_range: {
						field: "shipping_address.geo_point";
						ranges: [{ to: "10.0.0.5" }];
					};
					aggs: {
						by_status: { terms: { field: "status" } };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			with_sub: {
				buckets: [
					{
						key: `*-10.0.0.5`;
						doc_count: number;
						to: "10.0.0.5";
						by_status: {
							doc_count_error_upper_bound: number;
							sum_other_doc_count: number;
							buckets: Array<{
								key: "pending" | "completed" | "cancelled";
								doc_count: number;
							}>;
						};
					},
				];
			};
		}>();
	});
});
