// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
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
			ts: { buckets: Array<{ key: string | number; doc_count: number }> };
		}>();
	});

	test("docs example: keyed=true", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				ts: { time_series: { keyed: true } };
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			ts: { buckets: Record<string, { doc_count: number }> };
		}>();
	});
});
