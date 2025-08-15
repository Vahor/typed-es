import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Geo Centroid Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				centroid: {
					geo_centroid: {
						field: "shipping_address.geo_point";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			centroid: {
				location: {
					lat: number;
					lon: number;
				};
				count: number;
			};
		}>();
	});

	test("in a nested query", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				cities: {
					terms: { field: "shipping_address.city" };
					aggs: {
						centroid: {
							geo_centroid: { field: "shipping_address.geo_point" };
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			cities: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
					centroid: {
						location: {
							lat: number;
							lon: number;
						};
						count: number;
					};
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				centroid: {
					geo_centroid: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			centroid: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["centroid"]
			>;
		}>();
	});
});
