import { describe, expectTypeOf, test } from "bun:test";
import type { PossibleFields } from "../src/index";
import type { CustomIndexes } from "./shared";

describe("Field Extraction", () => {
	describe("defaults (includes non-leaf)", () => {
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
				| "shipping_address.postal_code"
				| "shipping_address.again"
				| "shipping_address.again.and_again"
				| "shipping_address.again.and_again.last_time";

			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("can't use variants with non-leaf fields", () => {
			type Value = PossibleFields<"orders", CustomIndexes, false, true>;
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
				| "shipping_address.postal_code"
				| "shipping_address.again"
				| "shipping_address.again.and_again"
				| "shipping_address.again.and_again.last_time"
				| `id.${string}`
				| `user_id.${string}`
				| `total.${string}`
				| `status.${string}`
				| `product_ids.${string}`
				| `created_at.${string}`
				| `shipping_address.street.${string}`
				| `shipping_address.city.${string}`
				| `shipping_address.country.${string}`
				| `shipping_address.postal_code.${string}`
				| `shipping_address.again.and_again.last_time.${string}`;

			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
	});
	describe("with non-leaf", () => {
		test("can be limited to leaf fields", () => {
			type Value = PossibleFields<"orders", CustomIndexes, true>;
			type Expected =
				| "id"
				| "user_id"
				| "product_ids"
				| "total"
				| "status"
				| "created_at"
				| "shipping_address.street"
				| "shipping_address.city"
				| "shipping_address.country"
				| "shipping_address.postal_code"
				| "shipping_address.again.and_again.last_time";

			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("can return variants", () => {
			type Value = PossibleFields<"orders", CustomIndexes, true, true>;
			type Expected =
				| "id"
				| "user_id"
				| "product_ids"
				| "total"
				| "status"
				| "created_at"
				| "shipping_address.street"
				| "shipping_address.city"
				| "shipping_address.country"
				| "shipping_address.postal_code"
				| "shipping_address.again.and_again.last_time"
				| `id.${string}`
				| `user_id.${string}`
				| `total.${string}`
				| `status.${string}`
				| `product_ids.${string}`
				| `created_at.${string}`
				| `shipping_address.street.${string}`
				| `shipping_address.city.${string}`
				| `shipping_address.country.${string}`
				| `shipping_address.postal_code.${string}`
				| `shipping_address.again.and_again.last_time.${string}`;

			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
	});
});
