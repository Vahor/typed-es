import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("Terms Aggregations", () => {
	test("without other aggs", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				"my-agg-name": {
					terms: {
						field: "entity_id",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			"my-agg-name": {
				buckets: Array<{
					key: unknown;
					doc_count: number;
				}>;
			};
		}>();
	});
});
