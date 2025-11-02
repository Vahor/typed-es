// @ts-nocheck
// TODO implement aggregation
import { describe, expectTypeOf, test } from "bun:test";
import type { TestAggregationOutput } from "../../shared";

describe("Inference Bucket Pipeline Aggregation", () => {
	test("docs-like example with composite and metrics", () => {
		type Aggregations = TestAggregationOutput<
			"demo",
			{
				client_ip: {
					composite: { sources: [{ client_ip: { terms: { field: "ip" } } }] };
					aggs: {
						url_dc: { cardinality: { field: "entity_id" } };
						bytes_sum: { sum: { field: "score" } };
						geo_src_dc: { cardinality: { field: "entity_id" } };
						geo_dest_dc: { cardinality: { field: "entity_id" } };
						responses_total: { value_count: { field: "date" } };
						success: { filter: { term: { status: "200" } } };
						error404: { filter: { term: { status: "404" } } };
						error503: { filter: { term: { status: "503" } } };
						malicious_client_ip: {
							inference: {
								model_id: string;
								buckets_path: {
									response_count: "responses_total";
									url_dc: "url_dc";
									bytes_sum: "bytes_sum";
									geo_src_dc: "geo_src_dc";
									geo_dest_dc: "geo_dest_dc";
									success: "success._count";
									error404: "error404._count";
									error503: "error503._count";
								};
							};
						};
					};
				};
			}
		>;

		expectTypeOf<Aggregations["aggregations"]>().toEqualTypeOf<{
			client_ip: {
				buckets: Array<{
					key: Record<string, unknown>;
					doc_count: number;
					url_dc: { value: number };
					bytes_sum: { value: number; value_as_string?: string };
					geo_src_dc: { value: number };
					geo_dest_dc: { value: number };
					responses_total: { value: number };
					success: { doc_count: number };
					error404: { doc_count: number };
					error503: { doc_count: number };
					malicious_client_ip: unknown;
				}>;
			};
		}>();
	});
});
