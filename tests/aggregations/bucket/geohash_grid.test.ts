import { describe, expectTypeOf, test } from "bun:test";
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
});
