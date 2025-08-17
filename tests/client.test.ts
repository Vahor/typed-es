import { describe, expectTypeOf, test } from "bun:test";
import { typedEs } from "../src/index";
import { client } from "./shared";

const query = typedEs(client, {
	index: "demo",
	_source: false,
});

describe("Client", () => {
	describe("transport options are respected", () => {
		describe("search", () => {
			test("with meta", () => {
				type Result = Awaited<
					ReturnType<typeof client.search<typeof query, { meta: true }>>
				>;
				expectTypeOf<Result>().toHaveProperty("body");
				expectTypeOf<Result>().toHaveProperty("statusCode");
				expectTypeOf<Result>().toHaveProperty("headers");
			});
			test("without meta", () => {
				type Result = Awaited<
					ReturnType<typeof client.search<typeof query, { meta: false }>>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
			test("without explicit options", () => {
				type Result = Awaited<ReturnType<typeof client.search<typeof query>>>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
		});

		describe("asyncSearch.get", () => {
			test("with meta", () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.get<typeof query, { meta: true }>
					>
				>;
				expectTypeOf<Result>().toHaveProperty("body");
				expectTypeOf<Result>().toHaveProperty("statusCode");
				expectTypeOf<Result>().toHaveProperty("headers");
			});
			test("without meta", () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.get<typeof query, { meta: false }>
					>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
			test("without explicit options", () => {
				type Result = Awaited<
					ReturnType<typeof client.asyncSearch.get<typeof query>>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
		});

		describe("asyncSearch.submit", () => {
			test("with meta", () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.submit<typeof query, { meta: true }>
					>
				>;
				expectTypeOf<Result>().toHaveProperty("body");
				expectTypeOf<Result>().toHaveProperty("statusCode");
				expectTypeOf<Result>().toHaveProperty("headers");
			});
			test("without meta", () => {
				type Result = Awaited<
					ReturnType<
						typeof client.asyncSearch.submit<typeof query, { meta: false }>
					>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
			test("without explicit options", () => {
				type Result = Awaited<
					ReturnType<typeof client.asyncSearch.submit<typeof query>>
				>;
				expectTypeOf<Result>().not.toHaveProperty("body");
				expectTypeOf<Result>().not.toHaveProperty("statusCode");
				expectTypeOf<Result>().not.toHaveProperty("headers");
			});
		});
	});

	// NOTE: skip as the client is undefined, only used for type checking
	describe.skip("using the client directly", () => {
		test("search", async () => {
			const result = await client.search({
				index: "demo",
				_source: ["score"],
				aggregations: {
					test: {
						terms: {
							field: "entity_id",
						},
					},
				},
			} as const);
			type Result = typeof result;
			expectTypeOf<Result>().toHaveProperty("aggregations");

			type Aggregations = Result["aggregations"];
			expectTypeOf<Aggregations>().toHaveProperty("test");
			expectTypeOf<Aggregations["test"]>().toHaveProperty("buckets");

			expectTypeOf<Result>().toHaveProperty("hits");
			expectTypeOf<Result["hits"]>().toHaveProperty("hits");
			expectTypeOf<Result["hits"]["hits"]>().toHaveProperty(0);
			type Hits0 = (typeof result)["hits"]["hits"][0];
			expectTypeOf<Hits0>().toHaveProperty("_source");
			expectTypeOf<Hits0["_source"]>().toEqualTypeOf<{
				score: number;
			}>();
		});

		test("asyncSearch.get", async () => {
			type query = {
				index: "demo";
				_source: ["score"];
				aggregations: {
					test: {
						terms: {
							field: "entity_id";
						};
					};
				};
			};
			const result = await client.asyncSearch.get<query>({
				id: "abc",
			});
			type Result = typeof result;
			expectTypeOf<Result>().toHaveProperty("response");

			type Response = (typeof result)["response"];
			expectTypeOf<Response>().toHaveProperty("aggregations");

			type Aggregations = Response["aggregations"];
			expectTypeOf<Aggregations>().toHaveProperty("test");
			expectTypeOf<Aggregations["test"]>().toHaveProperty("buckets");

			expectTypeOf<Response>().toHaveProperty("hits");
			expectTypeOf<Response["hits"]>().toHaveProperty("hits");
			expectTypeOf<Response["hits"]["hits"]>().toHaveProperty(0);
			type Hits0 = Response["hits"]["hits"][0];
			expectTypeOf<Hits0>().toHaveProperty("_source");
			expectTypeOf<Hits0["_source"]>().toEqualTypeOf<{
				score: number;
			}>();
		});

		test("asyncSearch.submit", async () => {
			const result = await client.asyncSearch.submit({
				index: "demo",
				_source: ["score"],
				aggregations: {
					test: {
						terms: {
							field: "entity_id",
						},
					},
				},
			} as const);
			type Result = typeof result;
			expectTypeOf<Result>().toHaveProperty("response");

			type Response = (typeof result)["response"];
			expectTypeOf<Response>().toHaveProperty("aggregations");

			type Aggregations = Response["aggregations"];
			expectTypeOf<Aggregations>().toHaveProperty("test");
			expectTypeOf<Aggregations["test"]>().toHaveProperty("buckets");

			expectTypeOf<Response>().toHaveProperty("hits");
			expectTypeOf<Response["hits"]>().toHaveProperty("hits");
			expectTypeOf<Response["hits"]["hits"]>().toHaveProperty(0);
			type Hits0 = Response["hits"]["hits"][0];
			expectTypeOf<Hits0>().toHaveProperty("_source");
			expectTypeOf<Hits0["_source"]>().toEqualTypeOf<{
				score: number;
			}>();
		});
	});
});
