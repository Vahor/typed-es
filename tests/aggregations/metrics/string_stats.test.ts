import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	type InvalidFieldTypeInAggregation,
	typedEs,
} from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("String Stats Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "reviews",
			size: 0,
			_source: false,
			aggs: {
				rating_stats: {
					string_stats: { field: "rating.string" },
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			rating_stats: {
				count: number;
				min_length: number;
				max_length: number;
				avg_length: number;
				entropy: number;
			};
		}>();
	});

	test("with show_distribution", () => {
		const query = typedEs(client, {
			index: "reviews",
			size: 0,
			_source: false,
			aggs: {
				rating_stats: {
					string_stats: { field: "rating.string", show_distribution: true },
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			rating_stats: {
				count: number;
				min_length: number;
				max_length: number;
				avg_length: number;
				entropy: number;
				distribution: Record<string, number>;
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		const query = typedEs(client, {
			index: "reviews",
			_source: false,
			size: 0,
			aggs: {
				rating_stats: { string_stats: { field: "rating" } },
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			rating_stats: InvalidFieldTypeInAggregation<
				"rating",
				"reviews",
				(typeof query)["aggs"]["rating_stats"],
				number,
				string
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "reviews",
			_source: false,
			size: 0,
			aggs: {
				invalid_stats: {
					string_stats: { field: "invalid" },
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid",
				"reviews",
				(typeof query)["aggs"]["invalid_stats"]
			>;
		}>();
	});
});
