import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("GeoLine Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				line: {
					geo_line: {
						point: { field: "shipping_address.geo_point" },
						sort: { field: "date" },
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggregations: {
				path: {
					terms: { field: "shipping_address.city" },
					aggregations: {
						museum_tour: {
							geo_line: {
								point: { field: "shipping_address.geo_point" },
								sort: { field: "date" },
							},
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				line: {
					geo_line: {
						point: { field: "invalid" },
						sort: { field: "date" },
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			line: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["line"]
			>;
		}>();
	});
});
