import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { WildcardSearch } from "../src/index";

describe("WildcardSearch", () => {
	type Words = "nested.field" | "created_at" | "title" | "updated_at";
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
