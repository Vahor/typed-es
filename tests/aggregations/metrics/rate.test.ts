import { describe, expectTypeOf, test } from "bun:test";
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
						value_as_string?: string;
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
						value_as_string?: string;
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
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});
});
