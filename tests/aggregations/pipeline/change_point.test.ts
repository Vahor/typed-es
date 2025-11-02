// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Change Point Pipeline Aggregation", () => {
	test("docs example: change points on avg over date histogram", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				date: {
					date_histogram: { field: "date"; fixed_interval: "1d" };
					aggs: { avg: { avg: { field: "score" } } };
				};
				change_points_avg: { change_point: { buckets_path: "date>avg" } };
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			date: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					avg: { value: number; value_as_string?: string };
				}>;
			};
			change_points_avg: {
				bucket?: {
					key: string | number;
					doc_count: number;
					avg: { value: number; value_as_string?: string };
				};
				type: Record<string, unknown>;
			};
		}>();
	});
});
