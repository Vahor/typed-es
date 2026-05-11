import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("CartesianCentroid Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				centroid: {
					cartesian_centroid: {
						field: "shipping_address.geo_point";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			centroid: {
				location: {
					x: number;
					y: number;
				};
				count: number;
			};
		}>();
	});

	test("inside a terms aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				cities: {
					terms: { field: "shipping_address.city" };
					aggs: {
						centroid: {
							cartesian_centroid: { field: "shipping_address.geo_point" };
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			cities: {
				sum_other_doc_count: number;
				doc_count_error_upper_bound: number;
				buckets: {
					key: string | number;
					doc_count: number;
					centroid: {
						location: {
							x: number;
							y: number;
						};
						count: number;
					};
				}[];
			};
		}>();
	});
});
