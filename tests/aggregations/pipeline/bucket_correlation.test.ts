import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Correlation Pipeline Aggregation", () => {
	test("docs example: correlates latency ranges per version", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				buckets: {
					terms: { field: "version"; size: 2 };
					aggs: {
						latency_ranges: {
							range: {
								field: "latency";
								ranges: [
									{ to: 0 },
									{ from: 0; to: 105 },
									{ from: 105; to: 225 },
									{ from: 225; to: 445 },
									{ from: 445; to: 665 },
									{ from: 665; to: 885 },
									{ from: 885; to: 1115 },
									{ from: 1115; to: 1335 },
									{ from: 1335; to: 1555 },
									{ from: 1555; to: 1775 },
									{ from: 1775 },
								];
							};
						};
						bucket_correlation: {
							bucket_correlation: {
								buckets_path: "latency_ranges>_count";
								function: {
									count_correlation: {
										indicator: {
											expectations: [
												0,
												52.5,
												165,
												335,
												555,
												775,
												1000,
												1225,
												1445,
												1665,
												1775,
											];
											doc_count: 200;
										};
									};
								};
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["buckets"]["buckets"][number]["bucket_correlation"]
		>().toEqualTypeOf<{
			value: number;
			value_as_string?: string;
		}>();
	});

	test("supports optional indicator fractions", () => {
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
						correlation: {
							bucket_correlation: {
								buckets_path: "score_ranges>_count";
								function: {
									count_correlation: {
										indicator: {
											expectations: [0, 5, 15, 20];
											doc_count: 100;
											fractions: [0.25, 0.25, 0.25, 0.25];
										};
									};
								};
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["buckets"]["buckets"][number]["correlation"]
		>().toEqualTypeOf<{
			value: number;
			value_as_string?: string;
		}>();
	});
});
