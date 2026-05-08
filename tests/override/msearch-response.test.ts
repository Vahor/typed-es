import { describe, expectTypeOf, test } from "bun:test";
import type {
	TypedMSearchResponse,
	TypedMsearchRequest,
} from "../../src/override/msearch-response";
import { type CustomIndexes, client } from "../shared";

type SuccessfulMsearchResponse<T> = Extract<
	T,
	{ "~type": "TypedSearchResponse" }
>;

describe("msearch aggregation response types", () => {
	test("preserves different aggregations per search", () => {
		const query = {
			index: "demo",
			searches: [
				{ index: "demo" },
				{
					_source: false,
					size: 0,
					aggregations: {
						score_stats: {
							stats: {
								field: "score",
							},
						},
					},
				},
				{ index: "orders" },
				{
					_source: false,
					size: 0,
					aggs: {
						statuses: {
							terms: {
								field: "status",
							},
						},
					},
				},
			] as const,
		} as const satisfies TypedMsearchRequest<CustomIndexes>;

		type Responses = TypedMSearchResponse<
			typeof query,
			CustomIndexes
		>["responses"];

		expectTypeOf<
			SuccessfulMsearchResponse<Responses[0]>["aggregations"]
		>().toEqualTypeOf<{
			score_stats: {
				count: number;
				min: number;
				min_as_string?: string;
				max: number;
				max_as_string?: string;
				avg: number;
				avg_as_string?: string;
				sum: number;
				sum_as_string?: string;
			};
		}>();
		expectTypeOf<
			SuccessfulMsearchResponse<Responses[1]>["aggregations"]
		>().toEqualTypeOf<{
			statuses: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: "pending" | "completed" | "cancelled";
					doc_count: number;
				}>;
			};
		}>();
	});
});

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
			if (search.hits) {
				const hits = search.hits;
				type Fields = (typeof hits.hits)[0]["_source"];

				expectTypeOf<Fields>().toEqualTypeOf<
					Pick<CustomIndexes["demo"], "score">
				>();
				expectTypeOf<typeof hits.total>().not.toEqualTypeOf<number>();
			}
		}
	});
	test("with multiple search", async () => {
		const response = await client.msearch({
			index: "demo",
			rest_total_hits_as_int: true,
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
		if (firstResponse.hits) {
			const hits = firstResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["demo"], "score" | "price">
			>();
			expectTypeOf<typeof hits.total>().toEqualTypeOf<number>();
		}
		const secondResponse = response.responses[1];
		if (secondResponse.hits) {
			const hits = secondResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["orders"], "status" | "product_ids">
			>();
			expectTypeOf<typeof hits.total>().toEqualTypeOf<number>();
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
					rest_total_hits_as_int: true,
				},
				{
					index: "orders",
				},
				{
					_source: ["status", "product_ids"],
					rest_total_hits_as_int: false,
				},
			],
		});
		const firstResponse = response.responses[0];
		if (firstResponse.hits) {
			const hits = firstResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<{
				comments: { created_at: string };
			}>();
			expectTypeOf<typeof hits.total>().toEqualTypeOf<number>();
		}
		const secondResponse = response.responses[1];
		if (secondResponse.hits) {
			const hits = secondResponse.hits;
			type Fields = (typeof hits.hits)[0]["_source"];
			expectTypeOf<Fields>().toEqualTypeOf<
				Pick<CustomIndexes["orders"], "status" | "product_ids">
			>();
			expectTypeOf<typeof hits.total>().not.toEqualTypeOf<number>();
		}
	});

	test("support array of searches with non-tuple type", async () => {
		const fakeQuery = ["hello", "world"];
		const response = await client.msearch({
			index: "issues",
			searches: fakeQuery.flatMap(
				(search) =>
					[
						{},
						{
							_source: ["comments.created_at"],
							query: { match: { title: search } },
							rest_total_hits_as_int: true,
						},
					] as const,
			),
		});
		for (const result of response.responses) {
			if (result.hits) {
				const hits = result.hits;
				type Fields = (typeof hits.hits)[0]["_source"];
				expectTypeOf<Fields>().toEqualTypeOf<{
					comments: { created_at: string };
				}>();
				expectTypeOf<typeof hits.total>().toEqualTypeOf<number>();
			}
		}
	});

	test("works even with readonly search query", async () => {
		const fakeQuery = ["hello", "world"] as const;
		const searches = fakeQuery.flatMap(
			(search) =>
				[
					{},
					{
						_source: ["comments.created_at"],
						query: { match: { title: search } },
						rest_total_hits_as_int: true,
					},
				] as const,
		);
		const response = await client.msearch({
			index: "issues",
			searches,
		});
		for (const result of response.responses) {
			if (result.hits) {
				const hits = result.hits;
				type Fields = (typeof hits.hits)[0]["_source"];
				expectTypeOf<Fields>().toEqualTypeOf<{
					comments: { created_at: string };
				}>();
				expectTypeOf<typeof hits.total>().toEqualTypeOf<number>();
			}
		}
	});
});
