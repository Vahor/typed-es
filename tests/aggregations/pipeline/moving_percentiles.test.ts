import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Moving Percentiles Pipeline Aggregation", () => {
	test("docs example: 1 and 99 percentiles", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "1M" };
					aggs: {
						the_percentile: {
							percentiles: { field: "price"; percents: [1.0, 99.0] };
						};
						the_movperc: {
							moving_percentiles: {
								buckets_path: "the_percentile";
								window: 10;
							};
						};
					};
				};
			}
		>;

		type A = Aggregations["aggregations"];
		//   ^?
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_date_histo: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					the_percentile: { values: { "1.0": number; "99.0": number } };
					the_movperc:
						| { values: { "1.0": number; "99.0": number } }
						| undefined;
				}>;
			};
		}>();
	});

	test("inherits keyed=false from source percentiles", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				my_date_histo: {
					date_histogram: { field: "date"; calendar_interval: "1M" };
					aggs: {
						the_percentile: {
							percentiles: {
								field: "price";
								percents: [1.0, 99.0];
								keyed: false;
							};
						};
						the_movperc: {
							moving_percentiles: {
								buckets_path: "the_percentile";
								window: number;
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			my_date_histo: {
				buckets: Array<{
					key_as_string: string;
					key: number;
					doc_count: number;
					the_percentile: {
						values: [
							{ key: "1.0"; value: number },
							{ key: "99.0"; value: number },
						];
					};
					the_movperc:
						| {
								values: [
									{ key: "1.0"; value: number },
									{ key: "99.0"; value: number },
								];
						  }
						| undefined;
				}>;
			};
		}>();
	});
});
