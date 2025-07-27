import type { estypes } from "@elastic/elasticsearch";
import type { TypedClient } from "../src/index";

export type SearchRequest = estypes.SearchRequest;

export type CustomIndexes = {
	demo: {
		score: number;
		entity_id: string;
		date: string;
	};
	demo2: {
		invalid: string;
	};
};

// biome-ignore lint/suspicious/noExplicitAny: client is not used in tests
export const client: TypedClient<CustomIndexes> = undefined as any;

export const testQueries = {
	invalidIndex: {
		index: "invalid",
		_source: ["score"],
	} as const satisfies SearchRequest,

	queryWithoutSource: {
		index: "demo",
	} as const satisfies SearchRequest,

	invalidSourceQuery: {
		index: "demo",
		_source: ["score", "invalid"],
	} as const satisfies SearchRequest,
};
