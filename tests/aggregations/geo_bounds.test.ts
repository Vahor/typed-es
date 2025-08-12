import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("GeoBounds Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				viewport: {
					geo_bounds: {
						field: "shipping_address.geo_point",
						wrap_longitude: true,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				viewport: {
					geo_bounds: {
						field: "invalid",
						wrap_longitude: true,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			viewport: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["viewport"]
			>;
		}>();
	});
});
