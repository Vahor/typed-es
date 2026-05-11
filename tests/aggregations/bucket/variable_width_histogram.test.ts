import { describe, expectTypeOf, test } from "bun:test";
import type { AtMostN } from "../../../src/types/helpers";
import type { TestAggregationOutput } from "../../shared";

describe("VariableWidthHistogram Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				prices: {
					variable_width_histogram: {
						field: "score";
						buckets: 2;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			prices: {
				buckets: AtMostN<
					{
						min: number;
						key: number;
						max: number;
						doc_count: number;
					},
					2
				>;
			};
		}>();

		const buckets = [] as Aggregations["aggregations"]["prices"]["buckets"];
		buckets[0];
		buckets[1];
		// @ts-expect-error: index out of bounds
		buckets[2];
	});

	test("supports nested sub-aggregations in buckets", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				prices: {
					variable_width_histogram: {
						field: "score";
						buckets: 10;
					};
					aggs: {
						by_status: { terms: { field: "price" } };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			prices: {
				buckets: AtMostN<
					{
						min: number;
						key: number;
						max: number;
						doc_count: number;
						by_status: {
							doc_count_error_upper_bound: number;
							sum_other_doc_count: number;
							buckets: Array<{
								key: number;
								doc_count: number;
							}>;
						};
					},
					10
				>;
			};
		}>();

		const buckets = [] as Aggregations["aggregations"]["prices"]["buckets"];
		buckets[2];
		buckets[9];
		// @ts-expect-error: index out of bounds
		buckets[10];
	});
});
