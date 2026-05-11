import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("BoxPlot Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				load_time_boxplot: {
					boxplot: {
						field: "load_time";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_boxplot: {
				min: number;
				max: number;
				q1: number;
				q2: number;
				q3: number;
				lower: number;
				upper: number;
			};
		}>();
	});
});
