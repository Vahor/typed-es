import type { estypes } from "@elastic/elasticsearch";
import type {
	ElasticsearchOutput,
	TypedClient,
	TypedSearchRequest,
} from "../src/index";

export type SearchRequest = estypes.SearchRequest;

export type CustomIndexes = {
	demo: {
		score: number;
		score_array: Array<number>;
		entity_id: string;
		date: string;
		ip: `${string}.${string}.${string}.${string}`;
		load_time: number;
		weight: number;
	};
	demo2: {
		invalid: string;
	};
	orders: {
		id: string;
		user_id: number;
		product_ids: string[];
		total: number;
		status: "pending" | "completed" | "cancelled";
		created_at: string;
		shipping_address: {
			geo_point: string;
			street: string;
			city: string;
			country: string;
			postal_code: string;
			again: {
				and_again: {
					last_time: string;
				};
			};
		};
	};
	test_types: {
		id: string;
		price: number;
		name: string;
		timestamp: Date;
	};
	reviews: {
		id: string;
		rating: number;
	};
};

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

export type TestAggregationOutput<
	Index extends keyof CustomIndexes,
	Aggregation extends TypedSearchRequest<CustomIndexes>["aggregations"],
> = {
	aggregations: ElasticsearchOutput<
		{
			index: Index;
			rest_total_hits_as_int: true;
			_source: false;
			size: 0;
			aggregations: Aggregation;
		},
		CustomIndexes,
		Index
	>["aggregations"];
	input: Aggregation;
};
