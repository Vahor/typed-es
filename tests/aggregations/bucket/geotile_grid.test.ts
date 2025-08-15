import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidPropertyTypeInAggregation,
} from "../../../src/index";
import type { RangeInclusive } from "../../../src/types/helpers";
import type { TestAggregationOutput } from "../../shared";

describe("Geotile Aggregations", () => {
	test("with default values", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				"large-grid": {
					geotile_grid: {
						field: "shipping_address.geo_point";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"large-grid": {
				buckets: Array<{
					key: `7/${number}/${number}`;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with higher precision", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				"large-grid": {
					geotile_grid: {
						field: "shipping_address.geo_point";
						precision: 22;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"large-grid": {
				buckets: Array<{
					key: `22/${number}/${number}`;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("supports nested sub-aggregations in buckets", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				grid: {
					geotile_grid: { field: "shipping_address.geo_point"; precision: 8 };
					aggs: {
						by_status: { terms: { field: "status" } };
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			grid: {
				buckets: Array<{
					key: `8/${number}/${number}`;
					doc_count: number;
					by_status: {
						doc_count_error_upper_bound: number;
						sum_other_doc_count: number;
						buckets: Array<{
							key: "pending" | "completed" | "cancelled";
							doc_count: number;
						}>;
					};
				}>;
			};
		}>();
	});

	test("fails when using a out of range precision", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				invalid_stats: {
					geotile_grid: {
						field: "shipping_address.geo_point";
						precision: 30;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidPropertyTypeInAggregation<
				"precision",
				Aggregations["input"]["invalid_stats"],
				30,
				RangeInclusive<0, 29>
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					geotile_grid: {
						field: "invalid";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
