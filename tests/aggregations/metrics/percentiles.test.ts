import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Percentiles Aggregation", () => {
	test("simple", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_outlier: {
					percentiles: {
						field: "total";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_outlier: {
				values: {
					"1.0": number;
					"5.0": number;
					"25.0": number;
					"50.0": number;
					"75.0": number;
					"95.0": number;
					"99.0": number;
				};
			};
		}>();
	});

	test("with custom percents", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_outlier: {
					percentiles: {
						field: "total";
						percents: [95, 99, 99.9];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_outlier: {
				values: {
					"95.0": number;
					"99.0": number;
					"99.9": number;
				};
			};
		}>();
	});

	test("with keyed=false", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				load_time_outlier: {
					percentiles: {
						field: "total.some_format";
						keyed: false;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			load_time_outlier: {
				values: [
					{
						key: "1.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "5.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "25.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "50.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "75.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "95.0";
						value: number;
						value_as_string?: string;
					},
					{
						key: "99.0";
						value: number;
						value_as_string?: string;
					},
				];
			};
		}>();
	});
});
