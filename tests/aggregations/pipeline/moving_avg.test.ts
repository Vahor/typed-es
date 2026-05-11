import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Moving Average Pipeline Aggregation", () => {
	test("docs example: moving average of monthly sales", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "1M" };
					aggs: {
						the_sum: { sum: { field: "price" } };
						the_movavg: {
							moving_avg: { buckets_path: "the_sum" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_date_histo: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					the_sum: { value: number; value_as_string?: string };
					the_movavg: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});

	test("supports model settings", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "1M" };
					aggs: {
						the_sum: { sum: { field: "price" } };
						the_movavg: {
							moving_avg: {
								buckets_path: "the_sum";
								model: "holt";
								window: 5;
								gap_policy: "insert_zeros";
								settings: { alpha: 0.8 };
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_date_histo: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					the_sum: { value: number; value_as_string?: string };
					the_movavg: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
