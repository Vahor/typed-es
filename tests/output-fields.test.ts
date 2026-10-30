import { describe, expectTypeOf, test } from "bun:test";
import { type ElasticsearchOutputFields, typedEs } from "../src";
import { type CustomIndexes, client } from "./shared";

describe("OutputFields", () => {
	test("default to all fields", () => {
		const query = typedEs(client, {
			index: "demo",
		});
		type Output = ElasticsearchOutputFields<
			typeof query,
			CustomIndexes,
			"orders",
			"_source"
		>;
		type Expected = CustomIndexes["orders"];
		expectTypeOf<Output>().toEqualTypeOf<Expected>();
	});

	test("excludes apply after wildcard includes", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: { includes: ["*"], excludes: ["status", "*_at"] },
		});
		type Output = ElasticsearchOutputFields<
			typeof query,
			CustomIndexes,
			"orders",
			"_source"
		>;
		expectTypeOf<Output>().toMatchTypeOf<
			Omit<CustomIndexes["orders"], "status" | "created_at">
		>();
		expectTypeOf<Output>().not.toHaveProperty("status");
		expectTypeOf<Output>().not.toHaveProperty("created_at");
	});

	test("nested excludes apply to an included parent object", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: {
				includes: ["shipping_address"],
				excludes: ["shipping_address.*code", "shipping_address.again"],
			},
		});
		type Output = ElasticsearchOutputFields<
			typeof query,
			CustomIndexes,
			"orders",
			"_source"
		>;
		expectTypeOf<Output>().toEqualTypeOf<{
			shipping_address: {
				geo_point: string;
				street: string;
				city: string;
				country: string;
			};
		}>();
	});

	test("excludes-only filters preserve arrays and optional objects", () => {
		type Indexes = {
			docs: {
				title: string;
				items: Array<{ name: string; secret: string }>;
				optional?: { keep: string; secret: string };
			};
		};
		type Output = ElasticsearchOutputFields<
			{
				index: "docs";
				_source: { exclude: ["items.secret", "optional.secret"] };
			},
			Indexes,
			"docs",
			"_source"
		>;
		expectTypeOf<Output>().toEqualTypeOf<{
			title: string;
			items: Array<{ name: string }>;
			optional?: { keep: string };
		}>();
	});
});
