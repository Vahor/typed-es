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
							key: number;
							doc_count: number;
							score_value: {
								value: number;
								value_as_string?: string;
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
						value_as_string?: string;
					};
					min_date: {
						value: number;
						value_as_string?: string;
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

	test("with conditional aggregations", () => {
		const fn = "" as "min" | "max" | "sum" | "avg" | "last";
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			rest_total_hits_as_int: true,
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
						value: {
							...(fn === "last"
								? {
										top_hits: {
											_source: ["total"],
											size: 1,
										} as const,
									}
								: { [fn as "min"]: { field: "total" } }),
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
					value:
						| {
								value: number;
								value_as_string?: string;
						  }
						| {
								hits: {
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
								};
						  };
				}>;
			};
		}>();
	});
});
