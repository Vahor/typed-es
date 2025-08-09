import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-histogram-aggregation
describe("Histogram Aggregations", () => {
	test("default", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				prices: {
					histogram: {
						field: "price",
						interval: 50,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			prices: {
				buckets: Array<{
					key: number;
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with keyed", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				prices: {
					histogram: {
						field: "price",
						interval: 50,
						keyed: true,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
