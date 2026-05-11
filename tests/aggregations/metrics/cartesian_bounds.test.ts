import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("CartesianBounds Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
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
});
