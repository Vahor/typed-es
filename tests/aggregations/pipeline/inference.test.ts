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

		expectTypeOf<
			Aggregations["aggregations"]["client_ip"]["buckets"][number]["malicious_client_ip"]
		>().toEqualTypeOf<unknown>();
	});
});
