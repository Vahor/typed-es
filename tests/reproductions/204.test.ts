import { describe, expectTypeOf, test } from "bun:test";
import { typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";
import { type CustomIndexes, client } from "../shared";

describe("adding a sort field in a query should make hits.[number].sort required ", async () => {
	test("with a sort field", async () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			sort: [{ entity_id: { order: "asc" } }],
		});
		type Result = TypedSearchResponse<typeof query, CustomIndexes>;
		type Hit = Result["hits"]["hits"][number];
		expectTypeOf<undefined>().not.toExtend<Hit["sort"]>();
	});
	test("without a sort field", async () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
		});
		type Result = TypedSearchResponse<typeof query, CustomIndexes>;
		type Hit = Result["hits"]["hits"][number];
		expectTypeOf<Hit["sort"]>().toBeNever();
	});
});
