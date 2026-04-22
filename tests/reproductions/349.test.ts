import { describe, expectTypeOf, test } from "bun:test";
import type { estypes } from "@elastic/elasticsearch";
import { typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";
import { client } from "../shared";

describe("349", () => {
	test("has_child with optional inner_hits", () => {
		const query = typedEs(client, {
			index: "demo",
			rest_total_hits_as_int: true,
			query: {
				bool: {
					filter: {
						has_child: {
							type: "aa",
							query: { match_all: {} },
							inner_hits: { size: 0 } as { size: 0 } | undefined,
						},
					},
				},
			},
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toEqualTypeOf<{
			aa:
				| undefined
				| {
						hits: {
							total: number;
							hits: Array<estypes.SearchHit<unknown>>;
						};
				  };
		}>();
	});
});
