import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("String Stats Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				rating_stats: {
					string_stats: { field: "rating.string" };
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
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
		type Aggregations = TestAggregationOutput<
			"reviews",
			{
				rating_stats: {
					string_stats: { field: "rating.string"; show_distribution: true };
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
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
});
