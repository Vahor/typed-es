import { describe, expectTypeOf, test } from "bun:test";
import { type RequestedIndex, typedEs } from "../src/index";
import { client } from "./shared";

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

		test("with invalid fields", () => {
			// @ts-expect-error: "invalid" is not a field in demo index
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

	describe("should enforce correct fields", () => {
		test("with valid fields", () => {
			const query = typedEs(client, {
				index: "demo",
				fields: ["score", "date"],
			});
			expectTypeOf<RequestedIndex<typeof query>>().toEqualTypeOf<"demo">();
		});

		test("with invalid fields", () => {
			// @ts-expect-error: "invalid" is not a field in demo index
			typedEs(client, {
				index: "demo",
				fields: ["score", { field: "invalid", format: "yyyy-MM-dd" }],
			});
		});
		test("with an object", () => {
			typedEs(client, {
				index: "demo",
				// @ts-expect-error: should be an array
				fields: {
					includes: ["score"],
				},
			});
		});
	});
});
