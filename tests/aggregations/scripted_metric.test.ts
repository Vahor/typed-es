import { describe, test } from "bun:test";
import { expectTypeOf } from "expect-type";
import { type ElasticsearchOutput, typedEs } from "../../src/index";
import { type CustomIndexes, client } from "../shared";

describe("scripted_metric Aggregations", () => {
	test("simulate a top_hits", () => {
		// Example taken from: https://www.elastic.co/docs/explore-analyze/transforms/transform-painless-examples#painless-top-hits
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
				latest_doc: {
					scripted_metric: {
						init_script: "state.timestamp_latest = 0L; state.last_doc = ''",
						map_script: `
def current_date = doc['@timestamp'].getValue().toInstant().toEpochMilli();
if (current_date > state.timestamp_latest)
{state.timestamp_latest = current_date;
state.last_doc = new HashMap(params['_source']);}
      `,
						combine_script: "return state",
						reduce_script: `
def last_doc = '';
def timestamp_latest = 0L;
for (s in states) {if (s.timestamp_latest > (timestamp_latest))
{timestamp_latest = s.timestamp_latest; last_doc = s.last_doc;}}
return last_doc
      `,
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
			latest_doc: {
				value: unknown;
			};
		}>();
	});
});
