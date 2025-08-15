import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("PercentileRanks Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_ranks: {
					percentile_ranks: {
						field: "total";
						values: [500, 600];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_ranks: {
				values: {
					"500.0": number;
					"600.0": number;
				};
			};
		}>();
	});

	test("with keyed=false", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_ranks: {
					percentile_ranks: {
						field: "total";
						values: [500, 600];
						keyed: false;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_ranks: {
				values: [
					{
						key: "500.0";
						value: number;
					},
					{
						key: "600.0";
						value: number;
					},
				];
			};
		}>();
	});

	test("fails when using an invalid type field", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_ranks: {
					percentile_ranks: {
						field: "id";
						values: [500, 600];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_ranks: InvalidFieldTypeInAggregation<
				"id",
				"orders",
				Aggregations["input"]["load_time_ranks"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				load_time_ranks: {
					percentile_ranks: {
						field: "invalid";
						values: [500, 600];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_ranks: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["load_time_ranks"]
			>;
		}>();
	});
});
