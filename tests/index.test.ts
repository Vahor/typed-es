import { describe, test } from "bun:test";
import type { estypes } from "@elastic/elasticsearch";
import { expectTypeOf } from "expect-type";
import {
	type ElasticsearchOutput,
	type RequestedFields,
	type RequestedIndex,
	type TypedClient,
	typedEs,
} from "../src/index";

type SearchRequest = estypes.SearchRequest;

type CustomIndexes = {
	demo: {
		score: number;
		entity_id: string;
		date: string;
	};
	demo2: {
		invalid: string;
	};
};

describe("Elasticsearch Types Interface", () => {
	const invalidIndex = {
		index: "invalid",
		_source: ["score"],
	} as const satisfies SearchRequest;

	const queryWithoutSource = {
		index: "demo",
	} as const satisfies SearchRequest;

	const invalidSourceQuery = {
		index: "demo",
		_source: ["score", "invalid"],
	} as const satisfies SearchRequest;

	// biome-ignore lint/suspicious/noExplicitAny: client is not used
	const client: TypedClient<CustomIndexes> = undefined as any;

	describe("Should extract the fields", () => {
		test("with _source", () => {
			expectTypeOf<
				RequestedFields<typeof invalidSourceQuery, CustomIndexes>
			>().toEqualTypeOf<"score" | "invalid">();
		});
		test("without _source", () => {
			expectTypeOf<
				RequestedFields<typeof queryWithoutSource, CustomIndexes>
			>().toEqualTypeOf<keyof CustomIndexes["demo"]>();
		});
		test("with _source set to false", () => {
			type Query = typeof queryWithoutSource & { _source: false };
			expectTypeOf<
				RequestedFields<Query, CustomIndexes>
			>().toEqualTypeOf<never>();
		});
	});

	test("Should extract the index", () => {
		expectTypeOf<
			RequestedIndex<typeof invalidIndex>
		>().toEqualTypeOf<"invalid">();
	});

	test("Should fail if the index is not found", () => {
		expectTypeOf<
			ElasticsearchOutput<typeof invalidIndex, CustomIndexes>
		>().toBeString();
	});

	describe("should enforce types based on options", () => {
		describe("track_total_hits", () => {
			test("set to true", () => {
				const query = typedEs(client, {
					index: "demo",
					track_total_hits: true,
					_source: false,
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["total"]>().toEqualTypeOf<
					number | estypes.SearchTotalHits
				>();
			});

			test("set to false", () => {
				const query = typedEs(client, {
					index: "demo",
					track_total_hits: false,
					_source: false,
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["total"]>().toEqualTypeOf<never>();
			});

			test("set to undefined", () => {
				const query = typedEs(client, {
					index: "demo",
					_source: false,
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["total"]>().toEqualTypeOf<
					number | estypes.SearchTotalHits
				>();
			});
		});
		describe("_source undefiend when set to false", () => {
			test("false", () => {
				const query = typedEs(client, {
					index: "demo",
					_source: false,
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<
					Output["hits"]["hits"][0]["_source"]
				>().toEqualTypeOf<never>();
			});
			test("undefined", () => {
				const query = typedEs(client, {
					index: "demo",
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Source = Output["hits"]["hits"][0]["_source"];
				expectTypeOf<Source>().toEqualTypeOf<CustomIndexes["demo"]>();
			});
			test("empty array", () => {
				const query = typedEs(client, {
					index: "demo",
					_source: [],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Source = Output["hits"]["hits"][0]["_source"];
				expectTypeOf<Source>().toEqualTypeOf<{}>();
			});
		});
	});

	describe("typedEs", () => {
		describe("Should enforce correct index", () => {
			test("with valid index", () => {
				const query = typedEs(client, {
					index: "demo",
					_source: [],
				});
				expectTypeOf<RequestedIndex<typeof query>>().toEqualTypeOf<"demo">();
			});
			test("with invalid index", () => {
				const _ = typedEs(client, {
					// @ts-expect-error: 'invalid' is not a valid index
					index: "invalid",
					_source: [],
				});
			});

			describe("Should enforce correct _source", () => {
				test("empty", () => {
					const _ = typedEs(client, {
						index: "demo",
						_source: [],
					});
				});
				test("with valid fields", () => {
					const query = typedEs(client, {
						index: "demo",
						_source: ["score", "date"],
					});
					expectTypeOf<
						RequestedFields<typeof query, CustomIndexes>
					>().toEqualTypeOf<"score" | "date">();
				});
				test("with invalid fields", () => {
					const _ = typedEs(client, {
						index: "demo",
						// @ts-expect-error: 'invalid' is not a valid field
						_source: ["score", "invalid"],
					});
				});
				test("with no _source", () => {
					const _ = typedEs(client, {
						index: "demo",
					});
				});
			});
		});

		describe("Should type the output", () => {
			test("Should fail if the field is not found", () => {
				expectTypeOf<
					ElasticsearchOutput<
						typeof invalidSourceQuery,
						CustomIndexes
					>["hits"]["hits"][0]["_source"]["invalid"]
				>().toBeString();
			});

			describe("Should return the correct type", () => {
				test("with _source", () => {
					expectTypeOf<
						ElasticsearchOutput<
							typeof invalidSourceQuery,
							CustomIndexes
						>["hits"]["hits"][0]["_source"]["score"]
					>().toEqualTypeOf<number>();
				});
				test("without _source", () => {
					expectTypeOf<
						ElasticsearchOutput<
							typeof queryWithoutSource,
							CustomIndexes
						>["hits"]["hits"][0]["_source"]
					>().toEqualTypeOf<CustomIndexes["demo"]>();
				});
				test("with _source set to false", () => {
					type Query = typeof queryWithoutSource & { _source: false };
					expectTypeOf<
						ElasticsearchOutput<
							Query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"]
					>().toEqualTypeOf<never>();
				});
			});

			describe("Should handle complex queries", () => {
				test("with pagination", () => {
					const query = typedEs(client, {
						index: "demo",
						size: 10,
						from: 0,
						_source: ["score"],
						aggs: {
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
				type Aggregations = NonNullable<Output["aggregations"]>;
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

			test("number agg on a non-number field", () => {
				const query = typedEs(client, {
					index: "demo",
					_source: false,
					aggs: {
						"my-agg-name": {
							value_count: {
								field: "entity_id",
							},
						},
					},
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Aggregations = NonNullable<Output["aggregations"]>;
				expectTypeOf<Aggregations>().toEqualTypeOf<{
					"my-agg-name": {
						value: number;
					};
				}>();
			});

			describe("aggs terms", () => {
				describe("without other aggs", () => {
					const query = typedEs(client, {
						index: "demo",
						_source: false,
						size: 0,
						aggs: {
							"my-agg-name": {
								terms: {
									field: "entity_id",
								},
							},
						},
					});
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Aggregations = NonNullable<Output["aggregations"]>;
					expectTypeOf<Aggregations>().toEqualTypeOf<{
						"my-agg-name": {
							buckets: Array<{
								key: unknown;
								doc_count: number;
							}>;
						};
					}>();
				});
			});
		});
	});
});
