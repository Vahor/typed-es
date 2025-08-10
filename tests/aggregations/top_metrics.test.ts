import { describe, expectTypeOf, test } from "bun:test";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("top_metrics Aggregations", () => {
	test("get the top 10 of a field", () => {
		const query = typedEs(client, {
			index: "orders",
			size: 0,
			_source: false,
			aggs: {
				max_score: {
					max: {
						field: "total",
					},
				},
				top_scores: {
					top_metrics: {
						sort: [
							{
								total: {
									order: "desc",
								},
							},
						],
						metrics: [
							{
								field: "total",
							},
						],
						size: 10,
					},
				},
			},
		});
		type Output = ElasticsearchOutput<typeof query, CustomIndexes>;
		type Aggregations = Output["aggregations"];
		expectTypeOf<Aggregations>().toEqualTypeOf<{
			max_score: {
				value: number;
				value_as_string?: string;
			};
			top_scores: {
				top: Array<{
					sort: unknown[];
					metrics: {
						total: number;
					};
				}>;
			};
		}>();
	});
});
