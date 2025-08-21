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
});
