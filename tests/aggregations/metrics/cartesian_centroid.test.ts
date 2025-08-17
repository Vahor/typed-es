import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { EsPoint, EsShape } from "../../../src/types/fields";
import type { TestAggregationOutput } from "../../shared";

describe("CartesianCentroid Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			// @ts-expect-error - Missing in elasticsearch doc
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
			// @ts-expect-error - Missing in elasticsearch doc
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

	test("fails when using an invalid field type", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			// @ts-expect-error - Missing in elasticsearch doc
			{
				invalid_stats: {
					cartesian_centroid: {
						field: "score";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldTypeInAggregation<
				"score",
				"demo",
				Aggregations["input"]["invalid_stats"],
				number,
				EsPoint | EsShape
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			// @ts-expect-error - Missing in elasticsearch doc
			{
				invalid_stats: {
					cartesian_centroid: {
						field: "invalid_field";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
