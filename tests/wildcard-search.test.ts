import { describe, expectTypeOf, test } from "bun:test";
import type {
	InverseWildcardSearch,
	WildcardSearch,
} from "../src/types/wildcard-search";

describe("WildcardSearch", () => {
	type Words = "nested.field" | "created_at" | "title" | "updated_at";
	describe("can return matches", () => {
		test("handle before wildcard", () => {
			type Value = WildcardSearch<Words, "*_at">;
			type Expected = "created_at" | "updated_at";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("handle after wildcard", () => {
			type Value = WildcardSearch<Words, "c*">;
			type Expected = "created_at";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("handle full wildcard", () => {
			type Value = WildcardSearch<Words, "*">;
			type Expected = Words;
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
		test("handle before and after wildcard", () => {
			type Value = WildcardSearch<Words, "*_*">;
			type Expected = "created_at" | "updated_at";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("handle nested fields", () => {
			type Value = WildcardSearch<Words, "nested.*">;
			type Expected = "nested.field";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
		test("still works with non-wildcard", () => {
			type Value = WildcardSearch<Words, "title">;
			type Expected = "title";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
		test("still works with non-wildcard and nested", () => {
			type Value = WildcardSearch<Words, "nested.field">;
			type Expected = "nested.field";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
	});

	describe("can return non matches", () => {
		test("find non matches", () => {
			type Value = InverseWildcardSearch<Words, "invalid" | "title">;
			type Expected = "invalid";
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});

		test("doesn't find non matches", () => {
			type Value = InverseWildcardSearch<Words, "*field">;
			type Expected = never;
			expectTypeOf<Value>().toEqualTypeOf<Expected>();
		});
	});
});
