import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

// https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation
describe("Filters Aggregations", () => {
	test("with anonymous filters", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				messages: {
					filters: {
						filters: [
							{ match: { body: "error" } },
							{ match: { body: "warning" } },
						],
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			messages: {
				buckets: Array<{
					doc_count: number;
				}>;
			};
		}>();
	});

	test("with named filters", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				messages: {
					filters: {
						filters: {
							errors: { match: { body: "error" } },
							warnings: { match: { body: "warning" } },
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				messages: {
					filters: {
						filters: {
							warnings: { match: { body: "warning" } },
						},
						other_bucket_key: "another_key",
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				messages: {
					filters: {
						filters: {
							errors: { match: { body: "error" } },
							warnings: { match: { body: "warning" } },
						},
						other_bucket_key: "another_key",
						keyed: false,
					},
				},
			},
		});

		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			messages: {
				buckets: Array<{
					key: "errors" | "warnings" | "another_key";
					doc_count: number;
				}>;
			};
		}>();
	});

	test("Should support nested aggregations", () => {
		const query = typedEs(client, {
			index: "demo",
			_source: false,
			size: 0,
			aggs: {
				the_filter: {
					filters: {
						keyed: false,
						filters: {
							"t-shirt": { term: { type: "t-shirt" } },
							hat: { term: { type: "hat" } },
						},
					},
					aggs: {
						avg_price: { avg: { field: "price" } },
						sort_by_avg_price: {
							bucket_sort: { sort: { avg_price: "asc" } },
						},
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
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
