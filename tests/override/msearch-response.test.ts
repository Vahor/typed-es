import { describe, expectTypeOf, test } from "bun:test";
import { type CustomIndexes, client } from "../shared";

describe.skip("Should return the correct type", () => {
	test("with a single search", async () => {
		const response = await client.msearch({
			index: "demo",
			searches: [
				{
					index: "demo",
				},
				{
					_source: ["score"],
				},
			],
		});
		for (const search of response.responses) {
			if ("hits" in search) {
				const hits = search.hits;
				type Fields = (typeof hits.hits)[0]["_source"];

				expectTypeOf<Fields>().toEqualTypeOf<
					Pick<CustomIndexes["demo"], "score">
				>();
			}
		}
	});
	test("with multiple search", async () => {
		const response = await client.msearch({
			index: "demo",
			searches: [
				{
					index: "demo",
				},
				{
					_source: ["score", "p*"],
				},
				{
					index: "orders",
				},
				{
					_source: ["status", "product_ids"],
				},
			],
		});
		const firstResponse = response.responses[0];
		if ("hits" in firstResponse) {
			const hits = firstResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["demo"], "score" | "price">
			>();
		}
		const secondResponse = response.responses[1];
		if ("hits" in secondResponse) {
			const hits = secondResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["orders"], "status" | "product_ids">
			>();
		}
	});
	test("with multiple search - one missing index", async () => {
		const response = await client.msearch({
			index: "issues",
			searches: [
				// defaults to main index
				{},
				{
					_source: ["comments.created_at"],
				},
				{
					index: "orders",
				},
				{
					_source: ["status", "product_ids"],
				},
			],
		});
		const firstResponse = response.responses[0];
		if ("hits" in firstResponse) {
			const hits = firstResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<{
				comments: { created_at: string };
			}>();
		}
		const secondResponse = response.responses[1];
		if ("hits" in secondResponse) {
			const hits = secondResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["orders"], "status" | "product_ids">
			>();
		}
	});
});
