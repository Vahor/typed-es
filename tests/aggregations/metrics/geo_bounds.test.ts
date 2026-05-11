import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("GeoBounds Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				viewport: {
					geo_bounds: {
						field: "shipping_address.geo_point";
						wrap_longitude: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			viewport: {
				bounds: {
					top_left: {
						lat: number;
						lon: number;
					};
					bottom_right: {
						lat: number;
						lon: number;
					};
				};
			};
		}>();
	});
});
