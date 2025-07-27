import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../../src/index";
import { type CustomIndexes, client } from "../../shared";

describe("Composite Aggregations", () => {
	test("with pagination", () => {
		const query = typedEs(client, {
			index: "demo",
			size: 10,
			from: 0,
			_source: ["score"],
			aggregations: {
				page: {
					composite: {
						size: 10,
						sources: [{ entity: { terms: { field: "entity_id" } } }],
					},
					aggs: {
						daily: {
							date_histogram: {
								field: "@timestamp",
								calendar_interval: "day",
							},
							aggs: {
								score_value: { sum: { field: "score" } },
							},
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = NonNullable<Output["aggregations"]>;
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			page: {
				after_key: Record<string, unknown>;
				buckets: Array<{
					key: Record<string, unknown>;
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
				}>;
			};
		}>();

		expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<{
			score: number;
		}>();
	});
});
