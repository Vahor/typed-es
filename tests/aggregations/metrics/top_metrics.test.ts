import { describe, expectTypeOf, test } from "bun:test";
import type { MetricAggregations } from "../../../src";
import type { CustomIndexes, TestAggregationOutput } from "../../shared";

describe("top_metrics Aggregations", () => {
	test("docs example with a single metric", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				tm: {
					top_metrics: {
						metrics: { field: "score" };
						sort: { latency: "desc" };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			tm: {
				top: Array<{ sort: unknown[]; metrics: { score: number } }>;
			};
		}>();
	});

	test("readonly metric lists retain each field's type", () => {
		type Output = MetricAggregations.TopMetrics<
			CustomIndexes,
			"demo",
			{
				top_metrics: {
					metrics: readonly [{ field: "score" }, { field: "entity_id" }];
				};
			}
		>;
		expectTypeOf<Output>().toEqualTypeOf<{
			top: Array<{
				sort: unknown[];
				metrics: { score: number; entity_id: string };
			}>;
		}>();
	});

	test("get the top 10 of a field", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				max_score: {
					max: {
						field: "total";
					};
				};
				top_scores: {
					top_metrics: {
						sort: [
							{
								total: {
									order: "desc";
								};
							},
						];
						metrics: [
							{
								field: "total";
							},
						];
						size: 10;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			max_score: {
				value: number;
				value_as_string?: string;
			};
			top_scores: {
				top: Array<{
					sort: unknown[];
					metrics: {
						total: number;
					};
				}>;
			};
		}>();
	});
});
