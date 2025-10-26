import { describe, expectTypeOf, test } from "bun:test";
import type { ChangePointAggs } from "../../../src/aggregations/pipeline/change_point";

describe("Change Point Aggregation", () => {
	test("output structure for change_point aggregation", () => {
		type ChangePointOutput = ChangePointAggs<{
			change_point: {
				buckets_path: "by_date>total_value";
			};
		}>;

		expectTypeOf<ChangePointOutput>().toEqualTypeOf<{
			bucket?: {
				key: string | number;
			};
			type?: {
				dip?: {
					p_value: number;
				};
				spike?: {
					p_value: number;
				};
				stationary?: Record<string, never>;
				step_change?: {
					p_value: number;
				};
				distribution_change?: {
					p_value: number;
				};
				trend_change?: {
					p_value: number;
					change_point: number;
				};
				non_stationary?: {
					p_value: number;
					trend?: string;
				};
			};
		}>();
	});

	test("returns never when change_point is not present", () => {
		type NotChangePoint = ChangePointAggs<{
			stats: {
				field: "score";
			};
		}>;

		expectTypeOf<NotChangePoint>().toEqualTypeOf<never>();
	});
});
