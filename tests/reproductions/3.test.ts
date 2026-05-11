import { describe, test } from "bun:test";
import { typedEs } from "../../src";
import { client } from "../shared";

describe("3", () => {
	test("validates literal _source fields against the selected index", () => {
		typedEs(client, {
			index: "demo",
			_source: ["score", "entity_id.keyword", "*ate"],
		});

		typedEs(client, {
			index: "demo",
			// @ts-expect-error: `invalid` is not a valid `_source` field for `demo`
			_source: ["score", "invalid"],
		});

		typedEs(client, {
			index: "demo",
			// @ts-expect-error: `missing*` does not match any `_source` field for `demo`
			_source: ["missing*"],
		});
	});

	test("validates literal _source filters against the selected index", () => {
		typedEs(client, {
			index: "orders",
			_source: {
				includes: ["shipping_address.street", "created_*"],
				// @ts-expect-error: `score` is not a valid `_source` field for `orders`
				excludes: ["score"],
			},
		});
	});

	test("allows dynamic field strings", () => {
		const field = "score" as string;

		typedEs(client, {
			index: "demo",
			_source: [field],
		});
	});
});
