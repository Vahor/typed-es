import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
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

	test("fails when using an invalid field type", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					boxplot: {
						field: "entity_id";
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

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					boxplot: {
						field: "invalid_field";
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
