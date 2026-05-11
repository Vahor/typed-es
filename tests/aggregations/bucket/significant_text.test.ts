import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Significant Text Aggregations", () => {
	test("basic use", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				significant_products: {
					significant_text: {
						field: "entity_id";
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			significant_products: {
				doc_count: number;
				buckets: Array<{
					key: string;
					doc_count: number;
					score: number;
					bg_count: number;
				}>;
			};
		}>();
	});
});
