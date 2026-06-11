import { expectTypeOf, test } from "bun:test";
import { type PossibleFields, type TypedClient, typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";

type Indexes = {
	products: {
		bidule: Array<{ value: string; description: string }>;
		readonly_bidule: ReadonlyArray<{ value: string }>;
		created_at: Date[];
	};
};

const client: TypedClient<Indexes> = undefined as any;

test("407: object array fields are possible leaf fields", () => {
	expectTypeOf<PossibleFields<"products", Indexes, true>>().toEqualTypeOf<
		| "bidule.value"
		| "bidule.description"
		| "readonly_bidule.value"
		| "created_at"
	>();
});

test("407: fields output groups one nested object array field", () => {
	const query = typedEs(client, {
		index: "products",
		_source: false,
		fields: ["bidule.value"],
	});

	type Output = TypedSearchResponse<typeof query, Indexes>;
	type Hit = Output["hits"]["hits"][number];

	expectTypeOf<Hit["fields"]>().toEqualTypeOf<{
		bidule: Array<{
			value: string[];
		}>;
	}>();
});

test("407: fields output merges nested object array fields", () => {
	const query = typedEs(client, {
		index: "products",
		_source: false,
		fields: ["bidule.value", "bidule.description", "readonly_bidule.value"],
	});

	type Output = TypedSearchResponse<typeof query, Indexes>;
	type Hit = Output["hits"]["hits"][number];

	expectTypeOf<Hit["fields"]>().toEqualTypeOf<{
		bidule: Array<{
			value: string[];
			description: string[];
		}>;
		readonly_bidule: Array<{
			value: string[];
		}>;
	}>();
});
