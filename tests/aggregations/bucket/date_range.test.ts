import { describe, expectTypeOf, test } from "bun:test";
import type { InvalidFieldInAggregation } from "../../../src/index";
import type { TestAggregationOutput } from "../../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-daterange-aggregation
describe("DateRange Aggregations", () => {
	test("with from-to", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				range: {
					date_range: {
						field: "date";
						format: "MM-yyyy";
						ranges: [
							{ to: "2016/02/01" },
							{ from: "2016/02/01"; to: "now/d" },
							{ from: "now/d" },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			range: {
				buckets: [
					{
						to: number;
						to_as_string: string;
						doc_count: number;
						key: `*-${string}`;
					},
					{
						from: number;
						from_as_string: string;
						to: number;
						to_as_string: string;
						doc_count: number;
						key: `${string}-${string}`;
					},
					{
						from: number;
						from_as_string: string;
						doc_count: number;
						key: `${string}-*`;
					},
				];
			};
		}>();
	});

	test("with keyed", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				range: {
					date_range: {
						field: "date";
						format: "MM-yyy";
						ranges: [{ to: "now-10M/M" }, { from: "now-10M/M" }];
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			range: {
				buckets: {
					[x: `*-${string}`]: {
						doc_count: number;
						to: number;
						to_as_string: string;
					};
					[x: `${string}-*`]: {
						doc_count: number;
						from: number;
						from_as_string: string;
					};
				};
			};
		}>();
	});

	test("with keyed and custom key", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				range: {
					date_range: {
						field: "date";
						format: "MM-yyy";
						ranges: [
							{ from: "01-2015"; to: "03-2015"; key: "quarter_01" },
							{ from: "03-2015"; to: "06-2015"; key: "quarter_02" },
							{ from: "06-2015"; key: "quarter_03_to_now" },
						];
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			range: {
				buckets: {
					quarter_01: {
						doc_count: number;
						from: number;
						from_as_string: string;
						to: number;
						to_as_string: string;
					};
					quarter_02: {
						doc_count: number;
						to: number;
						to_as_string: string;
						from: number;
						from_as_string: string;
					};
					quarter_03_to_now: {
						doc_count: number;
						from: number;
						from_as_string: string;
					};
				};
			};
		}>();
	});

	test("fails when using an invalid field", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				range: {
					date_range: {
						field: "invalid";
						format: "MM-yyy";
						ranges: [{ from: "01-2015"; to: "03-2015"; key: "quarter_01" }];
						keyed: true;
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			range: InvalidFieldInAggregation<
				"invalid",
				"demo",
				Aggregations["input"]["range"]
			>;
		}>();
	});
});
