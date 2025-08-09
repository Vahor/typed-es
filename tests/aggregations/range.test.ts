import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation
describe("Range Aggregations", () => {
	test("with from-to", () => {
		const startRange = 100 as number;
		const midRange = 200 as number;
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
							{ from: startRange, to: midRange },
							{ from: midRange, to: 500 },
							{ from: 500.0 },
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
						doc_count: number;
					},
					{
						key: `${number}-${number}`;
						from: number;
						to: number;
						doc_count: number;
					},
					{
						key: `${number}-500.0`;
						from: number;
						to: 500.0;
						doc_count: number;
					},
					{
						key: "500.0-*";
						from: 500.0;
						doc_count: number;
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
						ranges: [
							{ to: 100.1 },
							{ from: 100.1, to: 200.0 },
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
						key: "*-100.1";
						to: 100.1;
						doc_count: number;
					},
					{
						key: "100.1-200.0";
						from: 100.1;
						to: 200.0;
						doc_count: number;
					},
					{
						key: "200.0-*";
						from: 200.0;
						doc_count: number;
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
						doc_count: number;
					};
					"100.0-200.0": {
						from: 100.0;
						to: 200.0;
						doc_count: number;
					};
					"200.0-*": {
						from: 200.0;
						doc_count: number;
					};
				};
			};
		}>();
	});
});
