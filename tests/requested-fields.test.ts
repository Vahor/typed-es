import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import {
	type ExtractQuery_Source,
	type ExtractQueryFields,
	typedEs,
} from "../src/index";
import { type CustomIndexes, client } from "./shared";

describe("RequestedFields", () => {
	test("default to all fields", () => {
		const query = typedEs(client, {
			index: "orders",
		});
		type Expected = keyof CustomIndexes["orders"];

		expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<never>();
		expectTypeOf<
			ExtractQuery_Source<typeof query, CustomIndexes>
		>().toEqualTypeOf<Expected>();
	});

	test("empty fields does not change anything", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			fields: [],
		});

		expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<never>();
		expectTypeOf<
			ExtractQuery_Source<typeof query, CustomIndexes>
		>().toEqualTypeOf<never>();
	});

	test("handle nested fields", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: ["shipping_address.street"],
		});
		type Expected = "shipping_address.street";

		expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<never>();
		expectTypeOf<
			ExtractQuery_Source<typeof query, CustomIndexes>
		>().toEqualTypeOf<Expected>();
	});

	test("handle mixed fields and _source", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: ["user_id"],
			fields: [
				{
					field: "*_at",
					format: "yyyy-MM-dd",
				},
				"shipping_address.street",
			],
		});

		expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<
			"shipping_address.street" | "*_at"
		>();
		expectTypeOf<
			ExtractQuery_Source<typeof query, CustomIndexes>
		>().toEqualTypeOf<"user_id">();
	});

	test("handle fields key", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			fields: ["shipping_address.street"],
		});

		type Expected = "shipping_address.street";

		expectTypeOf<ExtractQueryFields<typeof query>>().toEqualTypeOf<Expected>();
		expectTypeOf<
			ExtractQuery_Source<typeof query, CustomIndexes>
		>().toEqualTypeOf<never>();
	});
});
