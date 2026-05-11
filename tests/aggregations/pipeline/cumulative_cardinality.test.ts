import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Cumulative Cardinality Pipeline Aggregation", () => {
	test("docs example: total new users per day", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				users_per_day: {
					date_histogram: { field: "date"; calendar_interval: "day" };
					aggs: {
						distinct_users: { cardinality: { field: "entity_id" } };
						total_new_users: {
							cumulative_cardinality: { buckets_path: "distinct_users" };
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			users_per_day: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					distinct_users: { value: number; value_as_string?: string };
					total_new_users: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});

	test("supports optional format", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				users_per_day: {
					date_histogram: { field: "date"; calendar_interval: "day" };
					aggs: {
						distinct_users: { cardinality: { field: "entity_id" } };
						total_new_users: {
							cumulative_cardinality: {
								buckets_path: "distinct_users";
								format: "#,###";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<
			Aggregations["aggregations"]["users_per_day"]["buckets"][number]["total_new_users"]
		>().toEqualTypeOf<{ value: number; value_as_string?: string }>();
	});
});
