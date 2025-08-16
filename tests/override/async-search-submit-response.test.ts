import { describe, expectTypeOf, test } from "bun:test";
import type { TypedAsyncSearchSubmitResponse } from "../../src/override/async-search-submit-response";
import type { CustomIndexes, testQueries } from "../shared";

describe("Should return the correct type", () => {
	test("response is a TypedSearchResponse", () => {
		expectTypeOf<
			TypedAsyncSearchSubmitResponse<
				typeof testQueries.invalidSourceQuery,
				CustomIndexes
			>["response"]["~type"]
		>().toEqualTypeOf<"TypedSearchResponse">();
	});

	test("but is still a valid AsyncSearchSubmitResponse", () => {
		type Result = TypedAsyncSearchSubmitResponse<
			typeof testQueries.invalidSourceQuery,
			CustomIndexes
		>;
		expectTypeOf<Result>().toHaveProperty("id");
		expectTypeOf<Result>().toHaveProperty("is_partial");
		expectTypeOf<Result>().toHaveProperty("is_running");
		expectTypeOf<Result>().toHaveProperty("response");
	});
});
