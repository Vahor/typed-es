import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("Geotile Aggregations", () => {
	test("with default values", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggregations: {
				"large-grid": {
					geotile_grid: {
						field: "shipping_address.geo_point",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			"large-grid": {
				buckets: Array<{
					key: `7/${number}/${number}`;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with higher precision", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggregations: {
				"large-grid": {
					geotile_grid: {
						field: "shipping_address.geo_point",
						precision: 22,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			"large-grid": {
				buckets: Array<{
					key: `22/${number}/${number}`;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				invalid_stats: {
					geotile_grid: {
						field: "invalid",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["invalid_stats"]
			>;
		}>();
	});
});
