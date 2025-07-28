import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import {
	type ElasticsearchOutput,
	type SearchRequest,
	typedEs,
} from "../src/index";
import { type CustomIndexes, client, type testQueries } from "./shared";

describe("Should return the correct type", () => {
	test("with _source", () => {
		expectTypeOf<
			ElasticsearchOutput<
				typeof testQueries.invalidSourceQuery,
				CustomIndexes
			>["hits"]["hits"][0]["_source"]["score"]
		>().toEqualTypeOf<number>();
	});

	test("support nested fields", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: ["shipping_address.street"],
		});
		type Output = ElasticsearchOutput<
			typeof query,
			CustomIndexes
		>["hits"]["hits"][0]["_source"];
		expectTypeOf<Output>().toEqualTypeOf<{
			shipping_address: {
				street: CustomIndexes["orders"]["shipping_address"]["street"];
			};
		}>();
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
