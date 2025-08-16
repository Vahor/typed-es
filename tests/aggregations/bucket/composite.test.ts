import { describe, expectTypeOf, test } from "bun:test";
import { typedEs } from "../../../src/index";
import type { TypedSearchResponse } from "../../../src/override/search-response";
import {
	type CustomIndexes,
	client,
	type TestAggregationOutput,
} from "../../shared";

describe("Composite Aggregations", () => {
	test("with pagination", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				page: {
					composite: {
						size: 10;
						sources: [
							{ entity: { terms: { field: "entity_id" } } },
							{ key2: { terms: { field: "score" } } },
						];
					};
					aggs: {
						daily: {
							date_histogram: {
								field: "date";
								calendar_interval: "day";
							};
							aggs: {
								score_value: { sum: { field: "score" } };
							};
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			page: {
				after_key: Record<"entity" | "key2", unknown>;
				buckets: Array<{
					key: Record<"entity" | "key2", unknown>;
					doc_count: number;
					daily: {
						buckets: Array<{
							key_as_string: string;
							key: number;
							doc_count: number;
							score_value: {
								value: number;
								value_as_string?: string;
							};
						}>;
					};
				}>;
			};
		}>();
	});

	test("with multiple aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"orders",
			{
				pagination: {
					composite: {
						sources: [
							{ entity: { terms: { field: "entity_id" } } },
							{ key2: { terms: { field: "score" } } },
						];
					};
					aggs: {
						max_date: {
							max: { field: "created_at" };
						};
						min_date: {
							min: { field: "created_at" };
						};
						terms_field: {
							terms: { field: "product_ids" };
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			pagination: {
				after_key: Record<"entity" | "key2", unknown>;
				buckets: Array<{
					key: Record<"entity" | "key2", unknown>;
					doc_count: number;
					max_date: {
						value: number | string;
						value_as_string?: string;
					};
					min_date: {
						value: number | string;
						value_as_string?: string;
					};
					terms_field: {
						doc_count_error_upper_bound: number;
						sum_other_doc_count: number;
						buckets: Array<{
							key: string | number;
							doc_count: number;
						}>;
					};
				}>;
			};
		}>();
	});

	test("with conditional aggregations", () => {
		const fn = "" as "min" | "max" | "sum" | "avg" | "last";
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			rest_total_hits_as_int: true,
			aggs: {
				pagination: {
					composite: {
						after: undefined,
						sources: [
							{ entity: { terms: { field: "entity_id" } } },
							{ key2: { terms: { field: "score" } } },
						],
					},
					aggs: {
						value: {
							...(fn === "last"
								? {
										top_hits: {
											_source: ["total"],
											size: 1,
										} as const,
									}
								: { [fn as "min"]: { field: "total" } }),
						},
					},
				},
			},
		});
		type Output = TypedSearchResponse<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];

		expectTypeOf<Aggregations>().toEqualTypeOf<{
			pagination: {
				after_key: Record<"entity" | "key2", unknown>;
				buckets: Array<{
					key: Record<"entity" | "key2", unknown>;
					doc_count: number;
					value:
						| {
								value: number;
								value_as_string?: string;
						  }
						| {
								hits: {
									total: number;
									max_score: number | null;
									hits: Array<{
										_index: "orders";
										_id: string;
										_source: {
											total: number;
										};
										sort: Array<unknown>;
										_score: number | null;
									}>;
								};
						  };
				}>;
			};
		}>();
	});
});
