import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import {
	type ElasticsearchOutput,
	type SearchRequest,
	typedEs,
} from "../src/index";
import { type CustomIndexes, client, type testQueries } from "./shared";

describe("Should return the correct type", () => {
	describe("hits", () => {
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

		test("with _source set to false", () => {
			type Query = typeof testQueries.queryWithoutSource & { _source: false };
			expectTypeOf<
				ElasticsearchOutput<Query, CustomIndexes>["hits"]["hits"][0]["_source"]
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
				expectTypeOf<OutputSource["shipping_address"]["city"]>().toEqualTypeOf<
					Expected["shipping_address"]["city"]
				>();
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
				expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<
					CustomIndexes["demo"]
				>();
			});
			test("with before wildcard", () => {
				const query = {
					index: "demo",
					_source: ["*core"],
				} as const satisfies SearchRequest;
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<{
					score: number;
				}>();
			});

			test("with after wildcard", () => {
				const query = {
					index: "demo",
					_source: ["sc*"],
				} as const satisfies SearchRequest;
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<{
					score: number;
				}>();
			});

			test("with before and after wildcard", () => {
				const query = {
					index: "demo",
					_source: ["*cor*"],
				} as const satisfies SearchRequest;
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<{
					score: number;
				}>();
			});
			test("can use wildcard and non-wildcard", () => {
				const query = {
					index: "demo",
					_source: ["*core", "entity_id"],
				} as const satisfies SearchRequest;
				type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
				expectTypeOf<Output["hits"]["hits"][0]["_source"]>().toEqualTypeOf<{
					score: number;
					entity_id: string;
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
			expectTypeOf<Output["aggregations"]>().not.toBeNullable();
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
			expectTypeOf<Output["aggregations"]>().not.toBeNullable();
		});
	});
});
