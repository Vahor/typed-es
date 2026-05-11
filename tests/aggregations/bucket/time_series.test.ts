import { describe, expectTypeOf, test } from "bun:test";
import type { TimeSeriesKey } from "../../../src/aggregations/bucket/time_series";
import type { TestAggregationOutput } from "../../shared";

describe("Time Series Bucket Aggregation", () => {
	test("docs example: keyed=false", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ts: { time_series: { keyed: false } };
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ts: {
				buckets: Array<{
					key: TimeSeriesKey;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with keyed=true", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ts: { time_series: { keyed: true } };
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ts: {
				buckets: Record<
					string,
					{
						key: TimeSeriesKey;
						doc_count: number;
					}
				>;
			};
		}>();
	});

	test("with nested aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ts: {
					time_series: { keyed: false };
					aggs: {
						max_price: { max: { field: "price" } };
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ts: {
				buckets: Array<{
					key: TimeSeriesKey;
					doc_count: number;
					max_price: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
