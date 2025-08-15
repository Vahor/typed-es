import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../../src/index";
import {
	type CustomIndexes,
	client,
	type TestAggregationOutput,
} from "../../shared";

describe("Leaf Function Aggregations", () => {
	test("with min", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				min_value: {
					min: {
						field: "total";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			min_value: {
				value: number;
				value_as_string?: string;
			};
		}>();
	});

	test("with generic function", () => {
		const fn = "" as "min" | "max" | "sum" | "avg";
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				value: {
					// HACK: adding as "min" to make sure it's not a string
					// HACK: Type assertion needed because TypeScript can't infer the dynamic key
					// All functions in the union return the same structure, so "min" is used as representative
					[fn as "min"]: { field: "total" },
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value: {
				value: number;
				value_as_string?: string;
			};
		}>();
	});

	test("with conditional generic function", () => {
		const fn = "" as "min" | "max" | "sum" | "avg";
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				value: {
					...(fn === "max"
						? {
								max: {
									field: "total" as const,
								},
							}
						: { [fn as "min"]: { field: "total" as const } }),
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value:
				| {
						value: number;
						value_as_string?: string;
				  }
				| {
						value: number;
						value_as_string?: string;
				  };
		}>();
	});

	test("with conditional generic function and different aggs", () => {
		const fn = "" as "min" | "max" | "sum" | "avg" | "last";
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			rest_total_hits_as_int: true,
			aggs: {
				value: {
					...(fn === "last"
						? ({
								top_hits: {
									_source: ["total"],
									size: 1,
								},
							} as const)
						: { [fn as "min"]: { field: "total" as const } }),
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value:
				| {
						value: number;
						value_as_string?: string;
				  }
				| {
						hits: {
							total: number;
							max_score: number | null;
							hits: Array<{
								_index: "orders";
								_id: string;
								_source: {
									total: number;
								};
								sort: Array<unknown>;
								_score: number | null;
							}>;
						};
				  };
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				min_value: {
					min: {
						field: "price",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			min_value: InvalidFieldInAggregation<
				"price",
				"demo",
				(typeof query)["aggs"]["min_value"]
			>;
		}>();
	});

	test("output type should be correct for all agg functions", () => {
		const query = typedEs(client, {
			index: "test_types",
			size: 0,
			_source: false,
			aggs: {
				str_min: {
					min: {
						field: "name",
					},
				},
				num_min: {
					min: {
						field: "price",
					},
				},
				date_min: {
					min: {
						field: "timestamp",
					},
				},
				//
				str_max: {
					max: {
						field: "name",
					},
				},
				num_max: {
					max: {
						field: "price",
					},
				},
				date_max: {
					max: {
						field: "timestamp",
					},
				},
				//
				num_avg: {
					avg: {
						field: "price",
					},
				},
				date_avg: {
					avg: {
						field: "timestamp",
					},
				},
				//
				num_sum: {
					sum: {
						field: "price",
					},
				},
				date_sum: {
					sum: {
						field: "timestamp",
					},
				},
				//
				str_value_count: {
					value_count: {
						field: "name",
					},
				},
				num_value_count: {
					value_count: {
						field: "price",
					},
				},
				date_value_count: {
					value_count: {
						field: "timestamp",
					},
				},
				//
				str_cardinality: {
					cardinality: {
						field: "name",
					},
				},
				num_cardinality: {
					cardinality: {
						field: "price",
					},
				},
				date_cardinality: {
					cardinality: {
						field: "timestamp",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			str_min: {
				value: number | string;
				value_as_string?: string;
			};
			num_min: {
				value: number;
				value_as_string?: string;
			};
			date_min: {
				value: number | string;
				value_as_string?: string;
			};
			str_max: {
				value: number | string;
				value_as_string?: string;
			};
			num_max: {
				value: number;
				value_as_string?: string;
			};
			date_max: {
				value: number | string;
				value_as_string?: string;
			};
			num_avg: {
				value: number;
				value_as_string?: string;
			};
			date_avg: {
				value: number | string;
				value_as_string?: string;
			};
			num_sum: {
				value: number;
				value_as_string?: string;
			};
			date_sum: {
				value: number | string;
				value_as_string?: string;
			};
			str_value_count: {
				value: number;
				value_as_string?: string;
			};
			num_value_count: {
				value: number;
				value_as_string?: string;
			};
			date_value_count: {
				value: number;
				value_as_string?: string;
			};
			str_cardinality: {
				value: number;
				value_as_string?: string;
			};
			num_cardinality: {
				value: number;
				value_as_string?: string;
			};
			date_cardinality: {
				value: number;
				value_as_string?: string;
			};
		}>();
	});
});
