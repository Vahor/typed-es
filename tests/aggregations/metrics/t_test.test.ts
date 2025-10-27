import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("T-Test Aggregation", () => {
	test("base case: paired t-test with field objects", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				t_test_result: {
					t_test: {
						a: {
							field: "total";
						};
						b: {
							field: "user_id";
						};
						type: "paired";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			t_test_result: {
				value: number;
			};
		}>();
	});

	test("with field objects", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				my_ttest: {
					t_test: {
						a: {
							field: "total";
						};
						b: {
							field: "user_id";
						};
						type: "homoscedastic";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_ttest: {
				value: number;
			};
		}>();
	});

	test("with heteroscedastic type", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_diff: {
					t_test: {
						a: {
							field: "score";
						};
						b: {
							field: "load_time";
						};
						type: "heteroscedastic";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_diff: {
				value: number;
			};
		}>();
	});

	test("without explicit type (defaults to heteroscedastic)", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				default_test: {
					t_test: {
						a: {
							field: "score";
						};
						b: {
							field: "price";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			default_test: {
				value: number;
			};
		}>();
	});

	test("with script and field in a", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				scripted_test: {
					t_test: {
						a: {
							field: "total";
							script: "doc['total'].value * 2";
						};
						b: {
							field: "user_id";
						};
						type: "paired";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			scripted_test: {
				value: number;
			};
		}>();
	});

	test("fails when using an invalid field a", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_test: {
					t_test: {
						a: {
							field: "invalid_field";
						};
						b: {
							field: "score";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_test: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_test"]
			>;
		}>();
	});

	test("fails when using an invalid field b", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_test_b: {
					t_test: {
						a: {
							field: "score";
						};
						b: {
							field: "invalid_field";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_test_b: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_test_b"]
			>;
		}>();
	});

	test("fails when both fields are invalid", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_both: {
					t_test: {
						a: {
							field: "invalid_a";
						};
						b: {
							field: "invalid_b";
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_both: InvalidFieldInAggregation<
				"invalid_a",
				"demo",
				Aggregations["input"]["invalid_both"]
			>;
		}>();
	});
});
