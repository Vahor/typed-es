import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("CartesianBounds Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			// @ts-expect-error - Missing in elasticsearch doc
			{
				viewport: {
					cartesian_bounds: {
						field: "shipping_address.geo_point";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			viewport: {
				bounds: {
					top_left: {
						x: number;
						y: number;
					};
					bottom_right: {
						x: number;
						y: number;
					};
				};
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			// @ts-expect-error - Missing in elasticsearch doc
			{
				viewport: {
					cartesian_bounds: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			viewport: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["viewport"]
			>;
		}>();
	});
});
