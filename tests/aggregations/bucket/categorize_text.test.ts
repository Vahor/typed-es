import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Categorize Text Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				categories: {
					categorize_text: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			categories: {
				buckets: Array<{
					key: string;
					doc_count: number;
					max_matching_length: number;
					regex: string;
				}>;
			};
		}>();
	});

	test("with sub-aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				text_categories: {
					categorize_text: {
						field: "entity_id";
					};
					aggs: {
						avg_score: {
							avg: {
								field: "score";
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			text_categories: {
				buckets: Array<{
					key: string;
					doc_count: number;
					max_matching_length: number;
					regex: string;
					avg_score: {
						value: number;
						value_as_string?: string;
					};
				}>;
			};
		}>();
	});
});
