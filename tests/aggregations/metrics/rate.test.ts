import { describe, expectTypeOf, test } from "bun:test";
import type {
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
} from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

describe("Rate Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				by_date: {
					date_histogram: {
						field: "date";
						calendar_interval: "month";
					};
					aggs: {
						my_rate: {
							rate: {
								unit: "year";
							};
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			by_date: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					my_rate: {
						value: number;
					};
				}>;
			};
		}>();
	});

	test("with custom field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				by_date: {
					date_histogram: {
						field: "date";
						calendar_interval: "month";
					};
					aggs: {
						avg_price: {
							rate: {
								field: "price";
								unit: "day";
							};
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			by_date: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					avg_price: {
						value: number;
					};
				}>;
			};
		}>();
	});

	test("inside a composite aggregation", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				buckets: {
					composite: {
						sources: [
							{
								month: {
									date_histogram: {
										field: "date";
										calendar_interval: "month";
									};
								};
							},
							{
								type: {
									terms: {
										field: "type";
									};
								};
							},
						];
					};
					aggs: {
						avg_price: {
							rate: {
								field: "price";
								unit: "day";
							};
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			buckets: {
				after_key: Record<"month" | "type", unknown>;
				buckets: Array<{
					key: Record<"month" | "type", unknown>;
					doc_count: number;
					avg_price: {
						value: number;
					};
				}>;
			};
		}>();
	});

	test("fails when using an invalid field type", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					rate: {
						field: "entity_id";
						unit: "day";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldTypeInAggregation<
				"entity_id",
				"demo",
				Aggregations["input"]["invalid_stats"],
				string,
				number
			>;
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				invalid_stats: {
					rate: {
						field: "invalid_field";
						unit: "day";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			invalid_stats: InvalidFieldInAggregation<
				"invalid_field",
				"demo",
				Aggregations["input"]["invalid_stats"]
			>;
		}>();
	});
});
