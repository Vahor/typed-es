// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Moving Function Pipeline Aggregation", () => {
	test("docs example: unweighted average over window", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "1M" };
					aggs: {
						the_sum: { sum: { field: "price" } };
						the_movfn: {
							moving_fn: {
								buckets_path: "the_sum";
								window: number;
								script: string;
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
					the_movfn: { value: number | null };
				}>;
			};
		}>();
	});
});
