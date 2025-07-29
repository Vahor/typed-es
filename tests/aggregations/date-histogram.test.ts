import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
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
						field: "@timestamp",
						calendar_interval: "year",
					},
					aggregations: {
						daily: {
							date_histogram: {
								field: "@timestamp",
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
					key: unknown;
					doc_count: number;
					daily: {
						buckets: Array<{
							key_as_string: string;
							key: unknown;
							doc_count: number;
							score_value: {
								value: number;
							};
						}>;
					};
					yearly_avg: {
						value: unknown;
					};
				}>;
			};
		}>();
	});
});
