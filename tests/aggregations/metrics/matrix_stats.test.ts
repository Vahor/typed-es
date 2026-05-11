import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Matrix Stats Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				statistics: {
					matrix_stats: {
						fields: ["price", "score"];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			statistics: {
				doc_count: number;
				fields: [
					{
						name: "price";
						count: number;
						mean: number;
						variance: number;
						skewness: number;
						kurtosis: number;
						covariance: Record<"price" | "score", number>;
						correlation: {
							price: 1.0;
							score: number;
						};
					},
					{
						name: "score";
						count: number;
						mean: number;
						variance: number;
						skewness: number;
						kurtosis: number;
						covariance: Record<"price" | "score", number>;
						correlation: {
							price: number;
							score: 1.0;
						};
					},
				];
			};
		}>();
	});

	test("with non string literal field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				statistics: {
					matrix_stats: {
						fields: string[];
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			statistics: {
				doc_count: number;
				fields: Array<{
					name: string;
					count: number;
					mean: number;
					variance: number;
					skewness: number;
					kurtosis: number;
					covariance: Record<string, number>;
					correlation: Record<string, number>;
				}>;
			};
		}>();
	});
});
