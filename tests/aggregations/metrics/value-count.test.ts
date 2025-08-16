import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Value Count Aggregations", () => {
	test("number agg on a non-number field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				"my-agg-name": {
					value_count: {
						field: "entity_id";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			"my-agg-name": {
				value: number;
				value_as_string?: string;
			};
		}>();
	});
});
