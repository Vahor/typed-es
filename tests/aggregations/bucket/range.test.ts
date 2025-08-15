import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation
describe("Range Aggregations", () => {
	test("with from-to", () => {
		const startRange = 100 as number;
		const midRange = 200 as number;
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					range: {
						field: "score";
						ranges: [
							{ to: typeof startRange },
							{ from: typeof startRange; to: typeof midRange },
							{ from: typeof midRange; to: 500 },
							{ from: 500.0 },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
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
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					range: {
						field: "score";
						ranges: [
							{ to: 100.1 },
							{ from: 100.1; to: 200.0 },
							{ from: 200.0 },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
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
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					range: {
						field: "score";
						keyed: true;
						ranges: [{ to: 100 }, { from: 100; to: 200 }, { from: 200 }];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
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

	test("with keyed and custom key", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					range: {
						field: "score";
						keyed: true;
						ranges: [
							{ key: "cheap"; to: 100 },
							{ key: "average"; from: 100; to: 200 },
							{ key: "expensive"; from: 200 },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_ranges: {
				buckets: {
					cheap: {
						to: 100.0;
						doc_count: number;
					};
					average: {
						from: 100.0;
						to: 200.0;
						doc_count: number;
					};
					expensive: {
						from: 200.0;
						doc_count: number;
					};
				};
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				price_ranges: {
					range: {
						field: "invalid";
						keyed: true;
						ranges: [{ to: 100 }, { from: 100; to: 200 }, { from: 200 }];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			price_ranges: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["price_ranges"]
			>;
		}>();
	});
});
