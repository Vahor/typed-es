import { expectTypeOf, test } from "bun:test";
import { type TypedClient, typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";

type Indexes = {
	demo: {
		score: number;
		entity_id: string;
		name: string;
	};
};

const client: TypedClient<Indexes> = undefined as any;

test("430: sort field is validated against the index schema", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: false,
		sort: [
			// @ts-expect-error `not_a_real_field` is not a valid field for index `demo`
			{ not_a_real_field: { order: "asc" } },
		],
	});
	expectTypeOf(query.sort).not.toBeAny();
});

test("430: valid sort field keeps the response typed", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: ["name"],
		sort: [{ entity_id: { order: "asc" } }],
	});

	type Output = TypedSearchResponse<typeof query, Indexes>;
	type Hit = Output["hits"]["hits"][number];
	expectTypeOf<Hit["sort"]>().not.toBeUndefined();
	expectTypeOf<Output["hits"]["hits"][number]["_source"]>().toEqualTypeOf<{
		name: string;
	}>();
});

test("430: nested sort fields are validated against the index schema", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: false,
		sort: [
			// @ts-expect-error `shipping_address.not_real` is not a valid field for index `demo`
			{ "shipping_address.not_real": { order: "asc" } },
		],
	});
	expectTypeOf(query.sort).not.toBeAny();
});
