import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	type InvalidFieldTypeInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Median Absolute Deviation Aggregation", () => {
	test("simple", () => {
		const query = typedEs(client, {
			index: "reviews",
			size: 0,
			_source: false,
			aggs: {
				review_average: {
					avg: {
						field: "rating",
					},
				},
				review_variability: {
					median_absolute_deviation: {
						field: "rating",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: {
				value: number;
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		const query = typedEs(client, {
			index: "reviews",
			_source: false,
			size: 0,
			aggs: {
				review_average: {
					avg: {
						field: "rating",
					},
				},
				review_variability: {
					median_absolute_deviation: {
						field: "id",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: InvalidFieldTypeInAggregation<
				"id",
				"reviews",
				(typeof query)["aggs"]["review_variability"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "reviews",
			_source: false,
			size: 0,
			aggs: {
				review_average: {
					avg: {
						field: "rating",
					},
				},
				review_variability: {
					median_absolute_deviation: {
						field: "invalid",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			review_average: {
				value_as_string?: string;
				value: number;
			};
			review_variability: InvalidFieldInAggregation<
				"invalid",
				"reviews",
				(typeof query)["aggs"]["review_variability"]
			>;
		}>();
	});
});
