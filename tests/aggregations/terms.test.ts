import { describe, expectTypeOf, test } from "bun:test";
import {
	type ElasticsearchOutput,
	type InvalidFieldInAggregation,
	typedEs,
} from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Terms Aggregations", () => {
	test("without other aggs", () => {
		const query = typedEs(client, {
			index: "orders",
			_source: false,
			size: 0,
			aggs: {
				number_agg: {
					terms: {
						field: "user_id",
					},
				},
				string_agg: {
					terms: {
						field: "product_ids",
					},
				},
				string_enum_agg: {
					terms: {
						field: "status",
						size: 10,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			number_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
			string_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: string | number;
					doc_count: number;
				}>;
			};
			string_enum_agg: {
				doc_count_error_upper_bound: number;
				sum_other_doc_count: number;
				buckets: Array<{
					key: "pending" | "completed" | "cancelled";
					doc_count: number;
				}>;
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				terms_agg: {
					terms: {
						field: "invalid",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			terms_agg: InvalidFieldInAggregation<
				"invalid",
				"demo",
				(typeof query)["aggs"]["terms_agg"]
			>;
		}>();
	});
});
