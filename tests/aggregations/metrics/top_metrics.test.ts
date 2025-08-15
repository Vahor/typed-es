import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("top_metrics Aggregations", () => {
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
