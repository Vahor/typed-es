import { describe, expectTypeOf, test } from "bun:test";
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
});
