// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Count K-S Test Pipeline Aggregation", () => {
	test("docs-like example with range buckets", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				buckets: {
					terms: { field: "entity_id"; size: 2 };
					aggs: {
						score_ranges: {
							range: {
								field: "score";
								ranges: [
									{ to: 0 },
									{ from: 0; to: 10 },
									{ from: 10; to: 20 },
									{ from: 20 },
								];
							};
						};
						ks_test: {
							bucket_count_ks_test: {
								buckets_path: "score_ranges>_count";
								alternative?: Array<"less" | "greater" | "two_sided">;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			buckets: {
				buckets: Array<{
					key: string | number;
					doc_count: number;
					score_ranges: {
						buckets: Array<{
							key: string;
							from?: number;
							to?: number;
							doc_count: number;
						}>;
					};
					ks_test: { less?: number; greater?: number; two_sided?: number };
				}>;
			};
		}>();
	});

	test("with limited alternatives changes output keys", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				buckets: {
					terms: { field: "entity_id"; size: 2 };
					aggs: {
						score_ranges: {
							range: {
								field: "score";
								ranges: [
									{ to: 0 },
									{ from: 0; to: 10 },
									{ from: 10; to: 20 },
									{ from: 20 },
								];
							};
						};
						ks_test: {
							bucket_count_ks_test: {
								buckets_path: "score_ranges>_count";
								alternative: ["greater"];
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			buckets: {
				buckets: Array<{
					key: string | number;
					doc_count: number;
					score_ranges: {
						buckets: Array<{
							key: string;
							from?: number;
							to?: number;
							doc_count: number;
						}>;
					};
					ks_test: { greater: number };
				}>;
			};
		}>();
	});
});
