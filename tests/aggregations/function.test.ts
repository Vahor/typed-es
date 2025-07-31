import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Leaf Function Aggregations", () => {
	test("with min", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				min_value: {
					min: {
						field: "total",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			min_value: {
				value: number;
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
					[fn as "min"]: { field: "total" },
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value: {
				value: number;
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
									field: "total",
								},
							}
						: { [fn as "min"]: { field: "total" } }),
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value:
				| {
						value: number;
				  }
				| {
						value: number;
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
						: { [fn as "min"]: { field: "total" } }),
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			value:
				| {
						value: number;
				  }
				| {
						hits: Array<{
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
						}>;
				  };
		}>();
	});
});
