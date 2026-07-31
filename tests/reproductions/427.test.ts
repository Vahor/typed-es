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

test("427: collapse field is validated against the index schema", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: false,
		collapse: {
			// @ts-expect-error `not_a_real_field` is not a valid field for index `demo`
			field: "not_a_real_field",
		},
	});
	expectTypeOf(query.collapse).not.toBeAny();
});

test("427: valid collapse field keeps the response typed", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: ["name"],
		collapse: {
			field: "entity_id",
			inner_hits: {
				name: "by_name",
			},
		},
	});

	type Output = TypedSearchResponse<typeof query, Indexes>;
	expectTypeOf<Output["hits"]["hits"][number]["_source"]>().toEqualTypeOf<{
		name: string;
	}>();
});

test("427: secondary collapse field is validated too", () => {
	const query = typedEs(client, {
		index: "demo",
		_source: false,
		collapse: {
			field: "entity_id",
			// @ts-expect-error `not_a_real_field` is not a valid field for index `demo`
			inner_hits: {
				name: "by_score",
				collapse: {
					field: "not_a_real_field",
				},
			},
		},
	});
	expectTypeOf(query.collapse).not.toBeAny();
});
