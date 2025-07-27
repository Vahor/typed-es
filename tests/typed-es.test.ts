import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import {
	type RequestedFields,
	type RequestedIndex,
	typedEs,
} from "../src/index";
import { type CustomIndexes, client } from "./shared";

describe("typedEs Function", () => {
	describe("Should enforce correct index", () => {
		test("with valid index", () => {
			const query = typedEs(client, {
				index: "demo",
				_source: [],
			});
			expectTypeOf<RequestedIndex<typeof query>>().toEqualTypeOf<"demo">();
		});

		test("with invalid index", () => {
			typedEs(client, {
				// @ts-expect-error: 'invalid' is not a valid index
				index: "invalid",
				_source: [],
			});
		});
	});

	describe("Should enforce correct _source", () => {
		test("empty", () => {
			typedEs(client, {
				index: "demo",
				_source: [],
			});
		});

		test("with valid fields", () => {
			const query = typedEs(client, {
				index: "demo",
				_source: ["score", "date"],
			});
			expectTypeOf<
				RequestedFields<typeof query, CustomIndexes>
			>().toEqualTypeOf<"score" | "date">();
		});

		test("with invalid fields", () => {
			typedEs(client, {
				index: "demo",
				_source: ["score", "invalid"],
			});
		});

		test("with no _source", () => {
			typedEs(client, {
				index: "demo",
			});
		});

		test("with include and exclude", () => {
			typedEs(client, {
				index: "demo",
				_source: {
					includes: ["score"],
					include: ["score"],
					excludes: ["score"],
					exclude: ["score"],
				},
			});
		});
	});
});
