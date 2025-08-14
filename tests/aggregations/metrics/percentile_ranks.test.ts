import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	type InvalidFieldTypeInAggregation,
	typedEs,
} from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("PercentileRanks Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				load_time_ranks: {
					percentile_ranks: {
						field: "total",
						values: [500, 600],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_ranks: {
				values: {
					"500.0": number;
					"600.0": number;
				};
			};
		}>();
	});

	test("with keyed=false", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			size: 0,
			aggs: {
				load_time_ranks: {
					percentile_ranks: {
						field: "total",
						values: [500, 600],
						keyed: false,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_ranks: {
				values: [
					{
						key: "500.0";
						value: number;
					},
					{
						key: "600.0";
						value: number;
					},
				];
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			size: 0,
			aggs: {
				load_time_ranks: {
					percentile_ranks: {
						field: "id",
						values: [500, 600],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_ranks: InvalidFieldTypeInAggregation<
				"id",
				"orders",
				(typeof query)["aggs"]["load_time_ranks"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				load_time_ranks: {
					percentile_ranks: {
						field: "invalid",
						values: [500, 600],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_ranks: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["load_time_ranks"]
			>;
		}>();
	});
});
