import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { PossibleFields } from "../src/index";
import type { CustomIndexes } from "./shared";

describe("Field Extraction", () => {
	test("handle nested fields", () => {
		type Value = PossibleFields<"orders", CustomIndexes>;
		type Expected =
			| "id"
			| "user_id"
			| "product_ids"
			| "total"
			| "status"
			| "created_at"
			| "shipping_address"
			| "shipping_address.street"
			| "shipping_address.city"
			| "shipping_address.country"
			| "shipping_address.postal_code";

		expectTypeOf<Value>().toEqualTypeOf<Expected>();
	});
});
