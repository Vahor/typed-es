import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Missing Aggregations", () => {
	test("missing without sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				products_without_price: {
					missing: {
						field: "price";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			products_without_price: {
				doc_count: number;
			};
		}>();
	});

	test("missing with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				orders_without_status: {
					missing: {
						field: "status";
					};
					aggs: {
						avg_total: {
							avg: {
								field: "total";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			orders_without_status: {
				doc_count: number;
				avg_total: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});

	test("missing with multiple sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				items_without_score: {
					missing: {
						field: "score";
					};
					aggs: {
						avg_weight: {
							avg: {
								field: "weight";
							};
						};
						max_load_time: {
							max: {
								field: "load_time";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			items_without_score: {
				doc_count: number;
				avg_weight: {
					value: number;
					value_as_string?: string;
				};
				max_load_time: {
					value: number;
					value_as_string?: string;
				};
			};
		}>();
	});
});
