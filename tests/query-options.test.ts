import { describe, test } from "bun:test";
import type { estypes } from "@elastic/elasticsearch";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../src/index";
import { type CustomIndexes, client } from "./shared";

describe("Query Options", () => {
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

	describe("_source behavior", () => {
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
