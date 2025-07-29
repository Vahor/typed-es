import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type RequestedFields, typedEs } from "../src/index";
import { type CustomIndexes, client } from "./shared";

describe("RequestedFields", () => {
	test("handle nested fields", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: ["shipping_address.street"],
		});
		type Value = RequestedFields<typeof query, CustomIndexes>;
		type Expected = "shipping_address.street";

		expectTypeOf<Value>().toEqualTypeOf<Expected>();
	});
});
