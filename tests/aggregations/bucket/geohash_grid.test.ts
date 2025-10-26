import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidPropertyTypeInAggregation,
} from "../../../src/index";
import type { RangeInclusive } from "../../../src/types/helpers";
import type { TestAggregationOutput } from "../../shared";

describe("Geohash Grid Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				geohash_buckets: {
					geohash_grid: {
						field: "shipping_address.geo_point";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_buckets: {
				buckets: Array<{
					key: string;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with precision specified", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				geohash_buckets: {
					geohash_grid: {
						field: "shipping_address.geo_point";
						precision: 8;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_buckets: {
				buckets: Array<{
					key: string;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				geohash_buckets: {
					geohash_grid: {
						field: "shipping_address.geo_point";
						precision: 5;
					};
					aggs: {
						avg_total: {
							avg: {
								field: "total";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_buckets: {
				buckets: Array<{
					key: string;
					doc_count: number;
					avg_total: {
						value: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				geohash_agg: {
					geohash_grid: {
						field: "invalid_field";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_agg: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["geohash_agg"]
			>;
		}>();
	});

	test("fails when using invalid precision (too low)", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				geohash_agg: {
					geohash_grid: {
						field: "shipping_address.geo_point";
						precision: 0;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_agg: InvalidPropertyTypeInAggregation<
				"precision",
				Aggregations["input"]["geohash_agg"],
				0,
				RangeInclusive<1, 12>
			>;
		}>();
	});

	test("fails when using invalid precision (too high)", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				geohash_agg: {
					geohash_grid: {
						field: "shipping_address.geo_point";
						precision: 13;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			geohash_agg: InvalidPropertyTypeInAggregation<
				"precision",
				Aggregations["input"]["geohash_agg"],
				13,
				RangeInclusive<1, 12>
			>;
		}>();
	});
});
