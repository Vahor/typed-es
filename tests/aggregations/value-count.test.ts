import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Value Count Aggregations", () => {
	test("number agg on a non-number field", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			aggs: {
				"my-agg-name": {
					value_count: {
						field: "entity_id",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			"my-agg-name": {
				value: number;
			};
		}>();
	});
});
