import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Date Histogram Aggregations", () => {
	test("with nested date_histogram", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				years: {
					date_histogram: {
						field: "date";
						calendar_interval: "year";
					};
					aggregations: {
						daily: {
							date_histogram: {
								field: "date";
								calendar_interval: "day";
							};
							aggs: {
								score_value: { sum: { field: "score" } };
							};
						};
						yearly_avg: {
							avg_bucket: {
								buckets_path: "daily>score_value";
								gap_policy: "insert_zeros";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			years: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					daily: {
						buckets: Array<{
							key_as_string: string;
							key: number;
							doc_count: number;
							score_value: {
								value: number;
								value_as_string?: string;
							};
						}>;
					};
					yearly_avg: {
						value: unknown;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});

	test("with keyed", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_over_time: {
					date_histogram: {
						field: "date";
						calendar_interval: "1M";
						format: "yyyy-MM-dd";
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_over_time: {
				buckets: Record<
					string,
					{
						doc_count: number;
						key: number;
						key_as_string: string;
					}
				>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				sales_over_time: {
					date_histogram: {
						field: "invalid";
						calendar_interval: "1M";
						format: "yyyy-MM-dd";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			sales_over_time: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["sales_over_time"]
			>;
		}>();
	});
});
