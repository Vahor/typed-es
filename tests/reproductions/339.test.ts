import { describe, expectTypeOf, test } from "bun:test";
import type { estypes } from "@elastic/elasticsearch";
import { typedEs } from "../../src";
import type { TypedSearchResponse } from "../../src/override/search-response";
import { client } from "../shared";

describe("has_child with inner_hits", () => {
	test("inner_hits keyed by has_child type, total follows rest_total_hits_as_int", () => {
		const query = typedEs(client, {
			index: "demo",
			rest_total_hits_as_int: true,
			query: {
				bool: {
					filter: {
						has_child: {
							type: "aa",
							query: { match_all: {} },
							inner_hits: { size: 0 },
						},
					},
				},
			},
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toEqualTypeOf<{
			aa: {
				hits: {
					total: number;
					hits: Array<estypes.SearchHit<unknown>>;
				};
			};
		}>();
	});

	test("no has_child -> inner_hits is undefined", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toBeUndefined();
	});

	test("inner_hits.name overrides the response key", () => {
		const query = typedEs(client, {
			index: "demo",
			rest_total_hits_as_int: true,
			query: {
				bool: {
					filter: {
						has_child: {
							type: "aa",
							query: { match_all: {} },
							inner_hits: { size: 0, name: "my_hits" },
						},
					},
				},
			},
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toEqualTypeOf<{
			my_hits: {
				hits: {
					total: number;
					hits: Array<estypes.SearchHit<unknown>>;
				};
			};
		}>();
	});

	test("multiple has_child in array filter -> union of keys", () => {
		const query = typedEs(client, {
			index: "demo",
			rest_total_hits_as_int: true,
			query: {
				bool: {
					filter: [
						{
							has_child: {
								type: "aa",
								query: { match_all: {} },
								inner_hits: { size: 0 },
							},
						},
						{
							has_child: {
								type: "aa",
								query: { match_all: {} },
								inner_hits: { size: 0, name: "aa2" },
							},
						},
					],
				},
			},
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toEqualTypeOf<{
			aa: {
				hits: {
					total: number;
					hits: Array<estypes.SearchHit<unknown>>;
				};
			};
			aa2: {
				hits: {
					total: number;
					hits: Array<estypes.SearchHit<unknown>>;
				};
			};
		}>();
	});

	test("without rest_total_hits_as_int, total is SearchTotalHits", () => {
		const query = typedEs(client, {
			index: "demo",
			query: {
				bool: {
					filter: {
						has_child: {
							type: "aa",
							query: { match_all: {} },
							inner_hits: { size: 0 },
						},
					},
				},
			},
		});

		type Result = TypedSearchResponse<typeof query, never>;
		type Hit = Result["hits"]["hits"][number];

		expectTypeOf<Hit["inner_hits"]>().toEqualTypeOf<{
			aa: {
				hits: {
					total: estypes.SearchTotalHits;
					hits: Array<estypes.SearchHit<unknown>>;
				};
			};
		}>();
	});
});
