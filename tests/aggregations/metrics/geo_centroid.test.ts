import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("Geo Centroid Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				centroid: {
					geo_centroid: {
						field: "shipping_address.geo_point",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				cities: {
					terms: { field: "shipping_address.city" },
					aggs: {
						centroid: {
							geo_centroid: { field: "shipping_address.geo_point" },
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				centroid: {
					geo_centroid: {
						field: "invalid",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			centroid: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["centroid"]
			>;
		}>();
	});
});
