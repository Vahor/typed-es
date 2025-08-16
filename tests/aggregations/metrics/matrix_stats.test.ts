import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
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

	test("fails when using an invalid type field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					matrix_stats: {
						fields: ["entity_id", "score"];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: {
				doc_count: number;
				fields: [
					InvalidFieldTypeInAggregation<
						"entity_id",
						"demo",
						Aggregations["input"]["invalid_stats"],
						string,
						number
					>,
					{
						name: "score";
						count: number;
						mean: number;
						variance: number;
						skewness: number;
						kurtosis: number;
						covariance: Record<"entity_id" | "score", number>;
						correlation: {
							entity_id: number;
							score: 1.0;
						};
					},
				];
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					matrix_stats: {
						fields: ["invalid", "score"];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: {
				doc_count: number;
				fields: [
					InvalidFieldInAggregation<
						"invalid",
						"demo",
						Aggregations["input"]["invalid_stats"]
					>,
					{
						name: "score";
						count: number;
						mean: number;
						variance: number;
						skewness: number;
						kurtosis: number;
						covariance: Record<"invalid" | "score", number>;
						correlation: {
							invalid: number;
							score: 1.0;
						};
					},
				];
			};
		}>();
	});
});
