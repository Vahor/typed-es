// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Correlation Pipeline Aggregation", () => {
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
						bucket_correlation: {
							bucket_correlation: {
								buckets_path: "score_ranges>_count";
								function: {
									count_correlation: {
										indicator: {
											expectations: number[];
											doc_count: number;
											fractions?: number[];
										};
									};
								};
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
					bucket_correlation: { value: number };
				}>;
			};
		}>();
	});
});
