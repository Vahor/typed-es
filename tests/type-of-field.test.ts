import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { TypeOfField } from "../src/index";
import type { CustomIndexes } from "./shared";

describe("TypeOfField", () => {
	test("handle simple fields", () => {
		type Value = TypeOfField<"id", CustomIndexes, "orders">;
		type Expected = CustomIndexes["orders"]["id"];
		expectTypeOf<Value>().toEqualTypeOf<Expected>();
	});

	test("handle object fields", () => {
		type Value = TypeOfField<"shipping_address", CustomIndexes, "orders">;
		type Expected = CustomIndexes["orders"]["shipping_address"];
		expectTypeOf<Value>().toEqualTypeOf<Expected>();
	});

	test("handle nested fields", () => {
		type Value = TypeOfField<
			"shipping_address.street",
			CustomIndexes,
			"orders"
		>;
		type Expected = CustomIndexes["orders"]["shipping_address"]["street"];
		expectTypeOf<Value>().toEqualTypeOf<Expected>();
	});
});
