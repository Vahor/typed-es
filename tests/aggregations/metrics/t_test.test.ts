import { describe, expectTypeOf, test } from "bun:test";
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
				value_as_string?: string;
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
				value_as_string?: string;
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
				value_as_string?: string;
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
				value_as_string?: string;
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
				value_as_string?: string;
			};
		}>();
	});

	test("type parameter does not affect output type", () => {
		type WithType = TestAggregationOutput<
			"demo",
			{
				with_type: {
					t_test: {
						a: { field: "score" };
						b: { field: "price" };
						type: "paired";
					};
				};
			}
		>;

		type WithoutType = TestAggregationOutput<
			"demo",
			{
				without_type: {
					t_test: {
						a: { field: "score" };
						b: { field: "price" };
					};
				};
			}
		>;

		expectTypeOf<WithType["aggregations"]["with_type"]>().toEqualTypeOf<
			WithoutType["aggregations"]["without_type"]
		>();
	});
});
