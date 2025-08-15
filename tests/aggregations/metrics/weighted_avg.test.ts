import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("WeightedAvg Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				weighted_score: {
					weighted_avg: {
						value: {
							field: "score";
						};
						weight: {
							field: "weight";
						};
					};
				};
				weighted_score_array: {
					weighted_avg: {
						value: {
							field: "score_array";
						};
						weight: {
							field: "weight";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			weighted_score: {
				value: number;
				value_as_string?: string;
			};
			weighted_score_array: {
				value: number;
				value_as_string?: string;
			};
		}>();
	});

	test("with script", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				weighted_score: {
					weighted_avg: {
						value: {
							script: "doc.score.value + 1";
						};
						weight: {
							field: "weight";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			weighted_score: {
				value: number;
				value_as_string?: string;
			};
		}>();
	});

	test("fails when using an invalid field type (weight)", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					weighted_avg: {
						value: {
							field: "score";
						};
						weight: {
							field: "entity_id";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldTypeInAggregation<
				"entity_id",
				"demo",
				Aggregations["input"]["invalid_stats"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field (weight)", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					weighted_avg: {
						value: {
							field: "score";
						};
						weight: {
							field: "invalid_field";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});

	test("fails when using an invalid field (value)", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					weighted_avg: {
						value: {
							field: "invalid_field";
						};
						weight: {
							field: "score";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
