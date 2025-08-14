import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	type InvalidFieldTypeInAggregation,
	typedEs,
} from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("Percentiles Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				load_time_outlier: {
					percentiles: {
						field: "total",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_outlier: {
				values: {
					"1.0": number;
					"5.0": number;
					"25.0": number;
					"50.0": number;
					"75.0": number;
					"95.0": number;
					"99.0": number;
				};
			};
		}>();
	});

	test("with custom percents", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				load_time_outlier: {
					percentiles: {
						field: "total",
						percents: [95, 99, 99.9],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_outlier: {
				values: {
					"95.0": number;
					"99.0": number;
					"99.9": number;
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
				load_time_outlier: {
					percentiles: {
						field: "total.some_format",
						keyed: false,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_outlier: {
				values: [
					{
						key: "1.0";
						value: number;
					},
					{
						key: "5.0";
						value: number;
					},
					{
						key: "25.0";
						value: number;
					},
					{
						key: "50.0";
						value: number;
					},
					{
						key: "75.0";
						value: number;
					},
					{
						key: "95.0";
						value: number;
					},
					{
						key: "99.0";
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
				load_time_outlier: {
					percentiles: {
						field: "id",
						keyed: false,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_outlier: InvalidFieldTypeInAggregation<
				"id",
				"orders",
				(typeof query)["aggs"]["load_time_outlier"],
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
				load_time_outlier: {
					percentiles: {
						field: "invalid",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			load_time_outlier: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["load_time_outlier"]
			>;
		}>();
	});
});
