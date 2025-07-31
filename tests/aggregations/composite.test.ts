import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

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
						sources: [
							{ entity: { terms: { field: "entity_id" } } },
							{ key2: { terms: { field: "score" } } },
						],
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
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			page: {
				after_key: Record<"entity" | "key2", unknown>;
				buckets: Array<{
					key: Record<"entity" | "key2", unknown>;
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

	test("with multiple aggregations", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			size: 0,
			aggs: {
				pagination: {
					composite: {
						after: undefined,
						sources: [
							{ entity: { terms: { field: "entity_id" } } },
							{ key2: { terms: { field: "score" } } },
						],
					},
					aggs: {
						max_date: {
							max: { field: "created_at" },
						},
						min_date: {
							min: { field: "created_at" },
						},
						terms_field: {
							terms: { field: "product_ids" },
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			pagination: {
				after_key: Record<"entity" | "key2", unknown>;
				buckets: Array<{
					key: Record<"entity" | "key2", unknown>;
					doc_count: number;
					max_date: {
						value: number;
					};
					min_date: {
						value: number;
					};
					terms_field: {
						buckets: Array<{
							key: unknown;
							doc_count: number;
						}>;
					};
				}>;
			};
		}>();
	});
});
