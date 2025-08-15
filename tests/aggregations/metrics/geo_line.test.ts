import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("GeoLine Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				line: {
					geo_line: {
						point: { field: "shipping_address.geo_point" };
						sort: { field: "date" };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			line: {
				type: "Feature";
				geometry: {
					type: "LineString";
					coordinates: Array<[number, number]>;
				};
				properties: {
					complete: boolean;
				};
			};
		}>();
	});

	test("with terms aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				path: {
					terms: { field: "shipping_address.city" };
					aggregations: {
						museum_tour: {
							geo_line: {
								point: { field: "shipping_address.geo_point" };
								sort: { field: "date" };
							};
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			path: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
					museum_tour: {
						type: "Feature";
						geometry: {
							type: "LineString";
							coordinates: Array<[number, number]>;
						};
						properties: {
							complete: boolean;
						};
					};
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				line: {
					geo_line: {
						point: { field: "invalid" };
						sort: { field: "date" };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			line: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["line"]
			>;
		}>();
	});
});
