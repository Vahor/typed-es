import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Bucket Count K-S Test Pipeline Aggregation", () => {
	test("docs example: compare latency ranges per version", () => {
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
						ks_test: {
							bucket_count_ks_test: {
								buckets_path: "latency_ranges>_count";
								alternative: ["less", "greater", "two_sided"];
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["buckets"]["buckets"][number]["ks_test"]
		>().toEqualTypeOf<{
			less: number;
			greater: number;
			two_sided: number;
		}>();
	});

	test("defaults to all alternatives when alternative is omitted", () => {
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
								buckets_path: ["score_ranges>_count"];
								fractions: number[];
								sampling_method: "uniform";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["buckets"]["buckets"][number]["ks_test"]
		>().toEqualTypeOf<{
			greater: number;
			less: number;
			two_sided: number;
		}>();
	});

	test("limits output keys to requested alternatives", () => {
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
								buckets_path: { count: "score_ranges>_count" };
								alternative: ["greater"];
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["buckets"]["buckets"][number]["ks_test"]
		>().toEqualTypeOf<{
			greater: number;
		}>();
	});
});
