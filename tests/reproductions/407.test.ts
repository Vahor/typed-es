import { expectTypeOf, test } from "bun:test";
import { type TypedClient, typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";

type Indexes = {
	products: {
		bidule: Array<{ value: string; description: string }>;
	};
};

const client: TypedClient<Indexes> = undefined as any;

test("407: fields output groups nested object array fields", () => {
	const query = typedEs(client, {
		index: "products",
		_source: false,
		fields: ["bidule.value", "bidule.description"],
	});

	type Output = TypedSearchResponse<typeof query, Indexes>;
	type Hit = Output["hits"]["hits"][number];

	expectTypeOf<Hit["fields"]>().toEqualTypeOf<{
		bidule: Array<{
			value: string[];
			description: string[];
		}>;
	}>();
});
