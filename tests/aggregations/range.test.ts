import { describe, test } from "bun:test";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { expectTypeOf } from "../helper";
import { type CustomIndexes, client } from "../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation
describe("Range Aggregations", () => {
	test("with from-to", () => {
		const startRange = 100 as number;
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				price_ranges: {
					range: {
						field: "price",
						ranges: [
							{ to: startRange },
							{ from: 100.0, to: 200.0 },
							{ from: 200.0 },
						],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			price_ranges: {
				buckets: [
					{
						key: `*-${number}`;
						to: number;
						doc_count: 2;
					},
					{
						key: `${number}-200.0`;
						from: number;
						to: 200.0;
						doc_count: 2;
					},
					{
						key: "200.0-*";
						from: 200.0;
						doc_count: 3;
					},
				];
			};
		}>();
	});

	test("with explicit from-to", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				price_ranges: {
					range: {
						field: "price",
						ranges: [{ to: 100 }, { from: 100.0, to: 200.0 }, { from: 200.0 }],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			price_ranges: {
				buckets: [
					{
						key: "*-100.0";
						to: 100.0;
						doc_count: 2;
					},
					{
						key: "100.0-200.0";
						from: 100.0;
						to: 200.0;
						doc_count: 2;
					},
					{
						key: "200.0-*";
						from: 200.0;
						doc_count: 3;
					},
				];
			};
		}>();
	});

	test("with keyed", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				price_ranges: {
					range: {
						field: "price",
						keyed: true,
						ranges: [{ to: 100 }, { from: 100, to: 200 }, { from: 200 }],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			price_ranges: {
				buckets: {
					"*-100.0": {
						to: 100.0;
						doc_count: 2;
					};
					"100.0-200.0": {
						from: 100.0;
						to: 200.0;
						doc_count: 2;
					};
					"200.0-*": {
						from: 200.0;
						doc_count: 3;
					};
				};
			};
		}>();
	});
});
