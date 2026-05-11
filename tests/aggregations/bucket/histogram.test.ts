import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Histogram Aggregations", () => {
	test("default", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				prices: {
					histogram: {
						field: "score";
						interval: 50;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			prices: {
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with keyed", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				prices: {
					histogram: {
						field: "score";
						interval: 50;
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			prices: {
				buckets: Record<
					`${number}`,
					{
						key: number;
						doc_count: number;
					}
				>;
			};
		}>();
	});
});
