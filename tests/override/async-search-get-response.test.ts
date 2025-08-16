import { describe, expectTypeOf, test } from "bun:test";
import type { TypedAsyncSearchGetResponse } from "../../src/override/async-search-get-response";
import type { CustomIndexes, testQueries } from "../shared";

describe("Should return the correct type", () => {
	test("response is a TypedSearchResponse", () => {
		expectTypeOf<
			TypedAsyncSearchGetResponse<
				typeof testQueries.invalidSourceQuery,
				CustomIndexes
			>["response"]["~type"]
		>().toEqualTypeOf<"TypedSearchResponse">();
	});
});
