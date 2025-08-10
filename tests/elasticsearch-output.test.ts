import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type SearchRequest,
	typedEs,
} from "../src/index";
import { type CustomIndexes, client, type testQueries } from "./shared";

describe("Should return the correct type", () => {
	describe("hits", () => {
		describe("_source", () => {
			test("with _source", () => {
				expectTypeOf<
					ElasticsearchOutput<
						typeof testQueries.invalidSourceQuery,
						CustomIndexes
					>["hits"]["hits"][0]["_source"]["score"]
				>().toEqualTypeOf<number>();
			});

			test("without _source", () => {
				expectTypeOf<
					ElasticsearchOutput<
						typeof testQueries.queryWithoutSource,
						CustomIndexes
					>["hits"]["hits"][0]["_source"]
				>().toEqualTypeOf<CustomIndexes["demo"]>();
			});

			describe("handle custom fields", () => {
				describe("on direct values", () => {
					// not an object
					test("on an existing field but with .keyword at the end", () => {
						const query = typedEs(client, {
							index: "demo",
							_source: ["entity_id.keyword"],
							fields: ["score.some_format"],
						});
						type OutputSource = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"];
						type OutputFields = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["fields"];
						type ExpectedSource = {
							entity_id: unknown;
						};
						type ExpectedFields = {
							score: unknown[];
						};
						expectTypeOf<OutputSource>().toEqualTypeOf<ExpectedSource>();
						expectTypeOf<OutputFields>().toEqualTypeOf<ExpectedFields>();
					});

					test("on an unknown field", () => {
						const query = typedEs(client, {
							index: "demo",
							_source: ["entity_id.keyword", "invalid"],
						});
						type OutputSource = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"];
						type Expected = {
							entity_id: unknown;
						};
						expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
					});
				});

				describe("on objects", () => {
					test("on a leaf field", () => {
						const query = typedEs(client, {
							index: "orders",
							_source: ["shipping_address.postal_code.keyword"],
						});
						type OutputSource = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"];
						type Expected = {
							shipping_address: {
								postal_code: unknown;
							};
						};
						expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
					});

					test("on the object itself", () => {
						const query = typedEs(client, {
							index: "orders",
							_source: ["shipping_address.keyword"],
						});
						type OutputSource = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"];
						type Expected = {};
						expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
					});

					test("on the object itself, but also querying for a leaf field", () => {
						const query = typedEs(client, {
							index: "orders",
							_source: [
								"shipping_address.keyword",
								"shipping_address.postal_code.keyword",
							],
						});
						type OutputSource = ElasticsearchOutput<
							typeof query,
							CustomIndexes
						>["hits"]["hits"][0]["_source"];
						type Expected = {
							shipping_address: {
								postal_code: unknown;
							};
						};
						expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
					});
				});
			});

			test("with _source set to false", () => {
				type Query = typeof testQueries.queryWithoutSource & { _source: false };
				expectTypeOf<
					ElasticsearchOutput<
						Query,
						CustomIndexes
					>["hits"]["hits"][0]["_source"]
				>().toEqualTypeOf<never>();
			});

			describe("handle nested fields", () => {
				test("with one field", () => {
					const query = typedEs(client, {
						index: "orders",
						_source: ["shipping_address.street"],
					});
					type OutputSource = ElasticsearchOutput<
						typeof query,
						CustomIndexes
					>["hits"]["hits"][0]["_source"];
					type Expected = {
						shipping_address: {
							street: CustomIndexes["orders"]["shipping_address"]["street"];
						};
					};
					expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
				});
				test("with two fields", () => {
					const query = typedEs(client, {
						index: "orders",
						_source: ["shipping_address.street", "shipping_address.city"],
					});
					type OutputSource = ElasticsearchOutput<
						typeof query,
						CustomIndexes
					>["hits"]["hits"][0]["_source"];
					type Expected = {
						shipping_address: {
							street: string;
							city: string;
						};
					};
					expectTypeOf<
						OutputSource["shipping_address"]["street"]
					>().toEqualTypeOf<Expected["shipping_address"]["street"]>();
					expectTypeOf<
						OutputSource["shipping_address"]["city"]
					>().toEqualTypeOf<Expected["shipping_address"]["city"]>();
				});
				test("with a deeply nested field", () => {
					const query = typedEs(client, {
						index: "orders",
						_source: ["shipping_address.again.and_again.last_time"],
					});
					type OutputSource = ElasticsearchOutput<
						typeof query,
						CustomIndexes
					>["hits"]["hits"][0]["_source"];
					type Expected = {
						shipping_address: {
							again: {
								and_again: {
									last_time: string;
								};
							};
						};
					};
					expectTypeOf<OutputSource>().toEqualTypeOf<Expected>();
				});
			});

			describe("support wildcards", () => {
				test("with _source set to *", () => {
					const query = {
						index: "demo",
						_source: ["*"],
					} as const satisfies SearchRequest;
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Hits = Output["hits"]["hits"][0];
					expectTypeOf<Hits["_source"]>().toEqualTypeOf<
						CustomIndexes["demo"]
					>();
				});
				test("with before wildcard", () => {
					const query = {
						index: "demo",
						_source: ["*core"],
					} as const satisfies SearchRequest;
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Hits = Output["hits"]["hits"][0];
					expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
						score: number;
					}>();
				});

				test("with after wildcard", () => {
					const query = {
						index: "demo",
						_source: ["sc*"],
					} as const satisfies SearchRequest;
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Hits = Output["hits"]["hits"][0];
					expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
						score: number;
					}>();
				});

				test("with before and after wildcard", () => {
					const query = {
						index: "demo",
						_source: ["*cor*"],
					} as const satisfies SearchRequest;
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Hits = Output["hits"]["hits"][0];
					expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
						score: number;
					}>();
				});
				test("can use wildcard and non-wildcard", () => {
					const query = {
						index: "demo",
						_source: ["*core", "entity_id"],
					} as const satisfies SearchRequest;
					type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
					type Hits = Output["hits"]["hits"][0];
					expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
						score: number;
						entity_id: string;
					}>();
				});
			});
		});

		describe("fields", () => {
			test("with fields", () => {
				const query = typedEs(client, {
					index: "orders",
					_source: false,
					fields: ["shipping_address.street"],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.street": string[];
				}>();
			});

			test("with fields and _source", () => {
				const query = typedEs(client, {
					index: "orders",
					_source: ["shipping_address.street"],
					fields: ["shipping_address.city"],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.city": string[];
				}>();
				expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
					shipping_address: {
						street: string;
					};
				}>();
			});

			test("with fields and wildcard", () => {
				const query = {
					index: "orders",
					_source: false,
					fields: [
						"shipping_address.str*",
						{ field: "*at", format: "yyyy-MM-dd" },
					],
				} as const satisfies SearchRequest;
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.street": string[];
					created_at: string[];
				}>();
			});
		});

		describe("docvalue_fields", () => {
			test("with docvalue_fields", () => {
				const query = typedEs(client, {
					index: "orders",
					_source: false,
					docvalue_fields: ["shipping_address.street"],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.street": string[];
				}>();
			});

			test("with docvalue_fields and _source", () => {
				const query = typedEs(client, {
					index: "orders",
					_source: ["shipping_address.street"],
					docvalue_fields: ["shipping_address.city"],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.city": string[];
				}>();
				expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
					shipping_address: {
						street: string;
					};
				}>();
			});

			test("with docvalue_fields and fields and _source and wildcard", () => {
				const query = typedEs(client, {
					index: "orders",
					_source: ["*_at"],
					docvalue_fields: ["shipping_address.city"],
					fields: ["shipping_address.street", "shipping_address"],
				});
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				type Hits = Output["hits"]["hits"][0];
				expectTypeOf<Hits["fields"]>().toEqualTypeOf<{
					"shipping_address.street": string[];
					"shipping_address.city": string[];
				}>();
				expectTypeOf<Hits["_source"]>().toEqualTypeOf<{
					created_at: string;
				}>();
			});
		});
	});

	describe("aggregations", () => {
		test("with no aggregations", () => {
			const query = typedEs(client, {
				index: "demo",
				_source: false,
				size: 0,
			});
			type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
			expectTypeOf<Output["aggregations"]>().toEqualTypeOf<never>();
		});

		test("with aggregations", () => {
			const query = typedEs(client, {
				index: "demo",
				_source: false,
				size: 0,
				aggs: {
					name: {
						terms: {
							field: "entity_id",
						},
					},
				},
			});
			type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
			expectTypeOf<Output["aggregations"]>().not.toEqualTypeOf<never>();
		});
	});
});
