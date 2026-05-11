import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Stats Aggregation", () => {
	test("with stats on numeric field", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				total_stats: {
					stats: {
						field: "total";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			total_stats: {
				count: number;
				min: number;
				min_as_string?: string;
				max: number;
				max_as_string?: string;
				avg: number;
				avg_as_string?: string;
				sum: number;
				sum_as_string?: string;
			};
		}>();
	});

	test("fails when using a non-numeric field", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				status_stats: {
					stats: {
						field: "status";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			status_stats: InvalidFieldTypeInAggregation<
				"status",
				"orders",
				Aggregations["input"]["status_stats"],
				"pending" | "completed" | "cancelled",
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					stats: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
