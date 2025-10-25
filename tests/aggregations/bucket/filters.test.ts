import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Filters Aggregations", () => {
	test("with anonymous filters", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				messages: {
					filters: {
						filters: [
							{ match: { body: "error" } },
							{ match: { body: "warning" } },
						];
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			messages: {
				buckets: Array<{
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with named filters", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				messages: {
					filters: {
						filters: {
							errors: { match: { body: "error" } };
							warnings: { match: { body: "warning" } };
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			messages: {
				buckets: {
					errors: {
						doc_count: number;
					};
					warnings: {
						doc_count: number;
					};
				};
			};
		}>();
	});

	test("with named filters and other_bucket_key", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				messages: {
					filters: {
						filters: {
							warnings: { match: { body: "warning" } };
						};
						other_bucket_key: "another_key";
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			messages: {
				buckets: {
					another_key: {
						doc_count: number;
					};
					warnings: {
						doc_count: number;
					};
				};
			};
		}>();
	});

	test("Should support `keyed` parameter", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				messages: {
					filters: {
						filters: {
							errors: { match: { body: "error" } };
							warnings: { match: { body: "warning" } };
						};
						other_bucket_key: "another_key";
						keyed: false;
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			messages: {
				buckets: Array<{
					key: "errors" | "warnings" | "another_key";
					doc_count: number;
				}>;
			};
		}>();
	});

	test("Should support nested aggregations", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				the_filter: {
					filters: {
						keyed: false;
						filters: {
							"t-shirt": { term: { type: "t-shirt" } };
							hat: { term: { type: "hat" } };
						};
					};
					aggs: {
						avg_price: { avg: { field: "score" } };
						sort_by_avg_price: {
							bucket_sort: { sort: { avg_price: "asc" } };
						};
					};
				};
			}
		>;
		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			the_filter: {
				buckets: Array<{
					key: "t-shirt" | "hat";
					doc_count: number;
					avg_price: { value: number; value_as_string?: string };
				}>;
			};
		}>();
	});
});
