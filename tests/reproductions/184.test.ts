import { expectTypeOf, test } from "bun:test";
import { type QueryTotal, typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";
import { type CustomIndexes, client } from "../shared";

test("type still works when sorting on _score with condition", async () => {
	const order: { field: "score" | "entity_id"; direction: "asc" | "desc" } = {
		field: "score",
		direction: "asc",
	};
	const query = typedEs(client, {
		index: "demo",
		_source: false,
		track_total_hits: true,
		rest_total_hits_as_int: true,
		sort:
			order.field === "score"
				? [{ score: { order: "asc" } }, { entity_id: { order: "asc" } }]
				: [{ entity_id: { order: "asc" } }],
	});

	type Total = QueryTotal<typeof query>;
	expectTypeOf<Total>().toEqualTypeOf<number>();

	type Result = TypedSearchResponse<typeof query, CustomIndexes>;
	expectTypeOf<Result["hits"]["total"]>().toEqualTypeOf<number>();
});
