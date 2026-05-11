import { describe, expectTypeOf, test } from "bun:test";
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
});
