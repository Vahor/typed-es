// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Serial Differencing Pipeline Aggregation", () => {
	test("docs example: lagged difference of sum", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "day" };
					aggs: {
						the_sum: { sum: { field: "score" } };
						thirtieth_difference: {
							serial_diff: { buckets_path: "the_sum"; lag: number };
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
					thirtieth_difference: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
