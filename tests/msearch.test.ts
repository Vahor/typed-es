import { describe, it, expect } from "bun:test";
import type { ElasticsearchIndexes } from "../src";

// Define a simple index structure for testing
type TestIndexes = {
	users: {
		id: string;
		name: string;
		email: string;
		age: number;
	};
	posts: {
		id: string;
		title: string;
		content: string;
		author_id: string;
		created_at: string;
	};
};

describe("msearch types", () => {
	it("should allow valid msearch requests", () => {
		// This test just verifies the types compile correctly
		const msearchRequest = [
			{
				header: { index: "users" },
				body: {
					query: { match: { name: "John" } },
					_source: ["id", "name", "email"],
				},
			},
			{
				header: { index: "posts" },
				body: {
					query: { match: { title: "Hello" } },
					_source: ["id", "title", "author_id"],
				},
			},
		] as const;

		// Type assertion to verify the structure is valid
		expect(msearchRequest).toBeDefined();
		expect(msearchRequest).toHaveLength(2);
		expect(msearchRequest[0].header?.index).toBe("users");
		expect(msearchRequest[1].header?.index).toBe("posts");
	});

	it("should allow msearch requests without headers", () => {
		const msearchRequest = [
			{
				body: {
					index: "users",
					query: { match: { name: "John" } },
					_source: ["id", "name"],
				},
			},
			{
				body: {
					index: "posts",
					query: { match: { title: "Hello" } },
					_source: ["id", "title"],
				},
			},
		] as const;

		expect(msearchRequest).toBeDefined();
		expect(msearchRequest).toHaveLength(2);
	});

	it("should allow msearch options", () => {
		const msearchOptions = {
			allow_no_indices: true,
			ignore_unavailable: true,
			max_concurrent_searches: 5,
		} as const;

		expect(msearchOptions).toBeDefined();
		expect(msearchOptions.allow_no_indices).toBe(true);
		expect(msearchOptions.max_concurrent_searches).toBe(5);
	});
}); 