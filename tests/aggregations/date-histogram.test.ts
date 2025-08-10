import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Date Histogram Aggregations", () => {
	test("with nested date_histogram", () => {
		const query = typedEs(client, {
			index: "demo",
			size: 0,
			_source: false,
			aggs: {
				years: {
					date_histogram: {
						field: "date",
						calendar_interval: "year",
					},
					aggregations: {
						daily: {
							date_histogram: {
								field: "date",
								calendar_interval: "day",
							},
							aggs: {
								score_value: { sum: { field: "score" } },
							},
						},
						yearly_avg: {
							avg_bucket: {
								buckets_path: "daily>score_value",
								gap_policy: "insert_zeros",
							},
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];

		expectTypeOf<Aggregations>().toEqualTypeOf<{
			years: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					daily: {
						buckets: Array<{
							key_as_string: string;
							key: number;
							doc_count: number;
							score_value: {
								value: number;
								value_as_string?: string;
							};
						}>;
					};
					yearly_avg: {
						value: unknown;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});

	test("with keyed", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				sales_over_time: {
					date_histogram: {
						field: "date",
						calendar_interval: "1M",
						format: "yyyy-MM-dd",
						keyed: true,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			sales_over_time: {
				buckets: Record<
					string,
					{
						doc_count: number;
						key: number;
						key_as_string: string;
					}
				>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				sales_over_time: {
					date_histogram: {
						field: "invalid",
						calendar_interval: "1M",
						format: "yyyy-MM-dd",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			sales_over_time: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["sales_over_time"]
			>;
		}>();
	});
});
