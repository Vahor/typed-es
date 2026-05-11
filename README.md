# Typed ES — type-safe Elasticsearch responses for TypeScript

[![Code quality](https://github.com/vahor/typed-es/actions/workflows/quality.yml/badge.svg)](https://github.com/vahor/typed-es/actions/workflows/quality.yml)
[![npm version](https://img.shields.io/npm/v/%40vahor%2Ftyped-es)](https://www.npmjs.com/package/@vahor/typed-es)
[![npm downloads](https://img.shields.io/npm/dm/%40vahor%2Ftyped-es)](https://www.npmjs.com/package/@vahor/typed-es)
[![license](https://img.shields.io/npm/l/%40vahor%2Ftyped-es)](https://github.com/Vahor/typed-es/blob/main/LICENSE)

Type-safe Elasticsearch responses for TypeScript, inferred from your actual search query.

`@vahor/typed-es` augments the official `@elastic/elasticsearch` client types so `_source`, `fields`, `hits.total`, `aggregations`, `msearch`, `asyncSearch`, and `inner_hits` stay synchronized with the query you wrote.

Without it, keeping correct manual response types means duplicating your query shape in TypeScript. Every time `_source`, `fields`, `track_total_hits`, or `aggs` changes, the matching `client.search<TDocument, TAggregations>()` types need to change too. That is tedious, easy to forget, and often ends in `as any`.

If you have ever written or maintained `client.search<TDocument, TAggregations>()`, `result.aggregations as any`, or `hit._source as MyType`, this library is for you.

- Works with the official Elasticsearch JavaScript client.
- No query builder or runtime DSL to learn: keep writing normal Elasticsearch requests.
- `typedEs` is a pass-through helper for type inference and does not change the Elasticsearch request.
- Can be used as a type-only/dev dependency if you only need the exported types.
- Tested with Elasticsearch `8` and `9`.

## Install

```sh
npm install @vahor/typed-es

# or with -D if you don't intend to use the typedEs wrapper. 
npm install -D @vahor/typed-es
```

`@vahor/typed-es` can be a type-only dependency. Install it as a dev dependency if you only use its exported types and do not call `typedEs` at runtime.

## Common problems solved

- Type-safe Elasticsearch aggregations in TypeScript.
- Inferred `_source` response types from selected fields and wildcards.
- Autocomplete for valid index names and requested fields.
- Safer `msearch` response typing per request.
- Fewer duplicated response interfaces that drift from the query over time.
- Fewer `as any`, non-null assertions, and hand-written aggregation result types.

<details>
<summary>Supported Aggregations</summary>

### Bucket Aggregations
| Aggregation | Status | Documentation |
|-------------|--------|---------------|
| Adjacency Matrix | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation) |
| Auto Date Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-autodatehistogram-aggregation) |
| Categorize Text | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-categorize-text-aggregation) |
| Children | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-children-aggregation) |
| Composite | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-composite-aggregation) |
| Date Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-datehistogram-aggregation) |
| Date Range | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-daterange-aggregation) |
| Diversified Sampler | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-diversified-sampler-aggregation) |
| Filter | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filter-aggregation) |
| Filters | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation) |
| Frequent Item Sets | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-frequent-item-sets-aggregation) |
| Geohash Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohashgrid-aggregation) |
| Geohex Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohexgrid-aggregation) |
| Geotile Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation) |
| Global | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-global-aggregation) |
| Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-histogram-aggregation) |
| IP Prefix | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-ipprefix-aggregation) |
| IP Range | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-iprange-aggregation) |
| Missing | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-missing-aggregation) |
| Multi Terms | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-multi-terms-aggregation) |
| Parent | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-parent-aggregation) |
| Nested | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-nested-aggregation) |
| Random Sampler | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-random-sampler-aggregation) |
| Range | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation) |
| Rare Terms | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-rare-terms-aggregation) |
| Reverse Nested | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-reverse-nested-aggregation) |
| Sampler | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-sampler-aggregation) |
| Significant Terms | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation) |
| Significant Text | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significanttext-aggregation) |
| Terms | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-terms-aggregation) |
| Time Series | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-time-series-aggregation) |
| Variable Width Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-variablewidthhistogram-aggregation) |

### Metrics Aggregations
| Aggregation | Status | Documentation |
|-------------|--------|---------------|
| Avg | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-avg-aggregation) |
| Boxplot | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-boxplot-aggregation) |
| Cardinality | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cardinality-aggregation) |
| Cartesian Bounds | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-bounds-aggregation) |
| Cartesian Centroid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-centroid-aggregation) |
| Extended Stats | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-extendedstats-aggregation) |
| Geo Bounds | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geobounds-aggregation) |
| Geo Centroid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geocentroid-aggregation) |
| Geo Line | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-geo-line) |
| Matrix Stats | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-matrix-stats-aggregation) |
| Max | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-max-aggregation) |
| Median Absolute Deviation | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-median-absolute-deviation-aggregation) |
| Min | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-min-aggregation) |
| Percentile Ranks | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-rank-aggregation) |
| Percentiles | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-percentile-aggregation) |
| Rate | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-rate-aggregation) |
| Scripted Metric | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-scripted-metric-aggregation) |
| Stats | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-stats-aggregation) |
| String Stats | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-string-stats-aggregation) |
| Sum | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-sum-aggregation) |
| T-Test | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-ttest-aggregation) |
| Top Hits | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-hits-aggregation) |
| Top Metrics | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-metrics) |
| Value Count | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-valuecount-aggregation) |
| Weighted Avg | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation) |

### Pipeline Aggregations
| Aggregation | Status | Documentation |
|-------------|--------|---------------|
| Average Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-avg-bucket-aggregation) |
| Bucket Script | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-script-aggregation) |
| Bucket Count K-S Test | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-count-ks-test-aggregation) |
| Bucket Correlation | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-correlation-aggregation) |
| Bucket Selector | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-selector-aggregation) |
| Bucket Sort | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-sort-aggregation) |
| Change Point | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-change-point-aggregation) |
| Cumulative Cardinality | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-cardinality-aggregation) |
| Cumulative Sum | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-sum-aggregation) |
| Derivative | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-derivative-aggregation) |
| Extended Stats Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-extended-stats-bucket-aggregation) |
| Inference | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-inference-bucket-aggregation) |
| Max Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-max-bucket-aggregation) |
| Min Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-min-bucket-aggregation) |
| Moving Function | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-movfn-aggregation) |
| Moving Percentiles | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-moving-percentiles-aggregation) |
| Normalize | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-normalize-aggregation) |
| Percentiles Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-percentiles-bucket-aggregation) |
| Serial Differencing | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-serialdiff-aggregation) |
| Stats Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-stats-bucket-aggregation) |
| Sum Bucket | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-sum-bucket-aggregation) |

</details>

## What gets typed

- **Search hits**: `_source` is inferred from the requested `_source` fields.
- **Elasticsearch aggregations**: aggregation output types are inferred from the `aggs`/`aggregations` object.
- **Requested fields**: `fields` and `docvalue_fields` appear on the response with the right field names.
- **Script fields**: `script_fields` appear on the response under `fields` with `unknown` values.
- **Total hits**: `hits.total` follows `track_total_hits` and `rest_total_hits_as_int`.
- **Wildcard `_source` selections**: `_source: ["*_at"]` narrows the response to matching fields like `created_at`.
- **Multi-search**: `msearch` responses preserve the type of each request pair.
- **Async search**: `asyncSearch.get<typeof query>()` can recover the original response type.
- **Child inner hits**: `has_child` + `inner_hits` is keyed by child `type` or `inner_hits.name`.

## Quick example

```ts
import { Client } from "@elastic/elasticsearch";
import { type TypedClient, typedEs } from "@vahor/typed-es";

type MyIndexes = {
	"my-index": {
		id: number;
		name: string;
		created_at: string;
	};
};

const client = new Client({ /* config */ }) as unknown as TypedClient<MyIndexes>;

const query = typedEs(client, {
	index: "my-index",
	_source: ["id", "na*"],
	fields: [{ field: "created_at", format: "yyyy-MM-dd" }],
	track_total_hits: true,
	rest_total_hits_as_int: true,
	aggs: {
		name_counts: { terms: { field: "name" } },
	},
});

const result = await client.search(query);

const total = result.hits.total;
//    ^? number

const firstHit = result.hits.hits[0];
//    ^? { _source: { id: number; name: string }, fields: { created_at: string[] } }

const buckets = result.aggregations.name_counts.buckets;
//    ^? Array<{ key: string | number; doc_count: number }>
```

See [`examples/search-and-aggregations.ts`](./examples/search-and-aggregations.ts) and the [`tests`](./tests) directory for more inference examples.

## Before / after

The official Elasticsearch client is flexible, but TypeScript often loses the exact response shape. You can write correct manual types, but then every query change also becomes a type-maintenance task. `@vahor/typed-es` keeps the query and response connected.

<details>
<summary>Same Example Without This Library</summary>

#### Without providing any types

```ts
const result = await client.search(query);
const total = result.hits.total; // number | estypes.SearchTotalHits | undefined
const firstHit = result.hits.hits[0]._source; // unknown
const aggregationBuckets = result.aggregations!.name_counts.buckets; // any, ts error: Object is possibly 'undefined'.
```

#### With manual type definitions

This works, but it duplicates the query shape. If you add a field to `_source`, rename `name_counts`, or change the aggregation type, you must remember to update these types too.

```ts
const result = await client.search<
  { id: number; created_at: string; },
  {
    name_counts: {
      buckets: Array<{ key: string; doc_count: number }>;
    };
  }
>(query);

const total = result.hits.total; // number | estypes.SearchTotalHits | undefined
const firstHit = result.hits.hits[0]; // { _source: { id: number; created_at: string; } | undefined, fields: Record<string, unknown> }
const aggregationBuckets = result.aggregations!.name_counts.buckets; // Array<{ key: string; doc_count: number; }>
```

#### With @vahor/typed-es

```ts
// Automatic type inference - no manual definitions needed
const result = await client.search(query);
const total = result.hits.total; // number
const firstHit = result.hits.hits[0]._source; // { id: number; created_at: string }
const aggregationBuckets = result.aggregations.name_counts.buckets; // Array<{ key: string | number; doc_count: number }> 
```

</details>

## Usage


### Step 1: Define your index types

```ts
type CustomIndexes = {
    "first-index": {
        score: number;
        entity_id: string;
        date: string;
    },
    "second-index": {
        "some-field": string;
    }
}
```

<details>
    <summary>For complex types like "point", "shape" even "date" we currently assume that the type is <code>string</code>.</summary>

ex:
```json
{
    "mappings": {
        "properties": {
            "location": {
                "type": "point"
            },
            "date": {
                "type": "date"
            }
        }
    }
}
```

would give:

```ts
type CustomIndexes = {
	"first-index": {
		location: string;
		date: string;
	};
};
```

</details>

### Step 2: Create a client

```ts
import { Client } from "@elastic/elasticsearch";
import type { TypedClient } from "@vahor/typed-es";

const client = new Client({
	// Elasticsearch client config
}) as unknown as TypedClient<CustomIndexes>;
```

### Step 3: Use the typedEs function

```ts
import { typedEs } from "@vahor/typed-es";

const query = typedEs(client, {
    index: "first-index",
    _source: ["score", "entity_id", "*ate"],
});

const queryWithAggs = typedEs(client, {
    index: "first-index",
    _source: ["score", "entity_id", "*ate"],
    aggs: {
        some_agg: {
            terms: {
                field: "entity_id",
            },
        },
    },
});
```

`typedEs` is a simple wrapper that adds type safety to `index` and autocompletes `_source`.
Check its definition in [typed-es.ts](./src/typed-es.ts); you can reuse the same pattern to add default values to your queries.

Note: when `_source` is missing, the output contains every field.

### Step 4: Enjoy an easy type-safe output

```ts
// Use the Elasticsearch client as usual
const output = await client.search(query);

// And without having to add .search<Sources, Aggs>(query) everywhere, you now have access to the correct types
const hits = output.hits.hits;
for (const hit of hits) {
    // Here hit is typed as { _source: { score: number; entity_id: string, date: string } }
    const score = hit._source.score; // typed as number
    const entity_id = hit._source.entity_id; // typed as string
    const invalid = hit._source.invalid; // error: Property 'invalid' does not exist on type '{ score: number; entity_id: string; }'
}


const outputWithAggs = await client.search(queryWithAggs);
const aggs = outputWithAggs.aggregations;
const someAgg = aggs.some_agg;
const someAggTerms = someAgg.buckets;
for (const bucket of someAggTerms) {
    // Here bucket is typed as { key: string | number; doc_count: number }
    const key = bucket.key; // typed as string | number
    const doc_count = bucket.doc_count; // typed as number
}
```

With this you also get type-errors when you try to access a field that doesn't exist in the index. Or an invalid index.
And with that, also autocompletion for these fields.
```ts
const invalidIndex = typedEs(client, {
    index: "invalid-index", // Here we get a: Type '"invalid-index"' is not assignable to type '"first-index" | "second-index"'. 
    _source: ["score", "entity_id"],
});
```

See more examples in the test files.

## Usage with `asyncSearch`

The [asyncSearch](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-async-search-get) API has some complexity for us. `submit` can infer the response type directly from the submitted query, but `get` does not include the original query type information by default.
To work around that, pass the original query type to `get`.

```typescript
const query = typedEs(...);

const submitted = await client.asyncSearch.submit(query);
const submittedData = submitted.response; // Same type as if you used client.search(query)

const result = await client.asyncSearch.get<typeof query>({ id: "abc" });
const data = result.response; // Same type as if you used client.search(query)

// If you don't have a query variable, you can pass the query type explicitly.
const result = await client.asyncSearch.get<{ query: ... }>({ id: "abc" });
```

## Usage with `msearch`

Run multiple searches in a single request with [msearch](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-msearch). The top-level `index` is used as the default. You can override the index per-search using the header that precedes each body.

```ts
// Assuming `client` is a TypedClient<YourIndexes>
const result = await client.msearch({
	index: "first-index",
	searches: [
		// 1) Uses top-level `index`: "first-index"
		{},
		{ _source: ["id", "name"] },

		// 2) Override index for this search
		{ index: "second-index" },
		{ _source: ["title"] },
	],
});

const first = result.responses[0];
const doc1 = first.hits.hits[0]._source; // { id: number; name: string }

const second = result.responses[1];
const doc2 = second.hits.hits[0]._source; // { title: string }
```

Notes:
- Responses preserve per-search typing: each `responses[i]` matches the corresponding header/body pair.
- `responses[i]` can be an error object if that search failed.

<details>
    <summary>Example with a dynamic search list</summary>

```ts
const ids = ["batman", "superman"];
const searches = ids.flatMap((id) => [{}, { query: { match: { id } }, _source: ["name"] }] as const);
//    ^? [{}, { query: { match: { id: "batman" | "superman" } }, _source: ["name"] }]
const result = await client.msearch({ index: "superheroes", searches);

for(const match of result.responses) {
    if(match.hits) {
	const hits = match.hits; // { hits: { _source: { name: string } } }
    }
}
```

Notes:
- You can still mix indexes, _searches, but here response[i] will be a union of the types of the responses.
</details>

## What if the library is missing a feature that you need?

Please open an issue or a PR.

If it's a type error and is urgent, you can add the types manually as you'd do without the library.

```typescript
const myBrokenQuery = typedEs(client, {
    index: "my-index",
    _source: ["score", "entity_id", "*ate"],
});

const result = await (client as unknown as Client).search<TDocument, TAggregations>(myBrokenQuery); // With the `as Client` cast you are now using the native types
```

## Limitations

- Query clauses and aggregation field parameters are not fully field-validated yet.
- Some aggregation functions might be missing.
- `_source` accepts arbitrary strings to support wildcards. Wildcards still produce the **correct inferred output type**.
- Client setup currently requires `as unknown as TypedClient<Indexes>` because the official client types are being augmented.
- `index` must be a concrete key, `_all`, or a list of concrete keys. Wildcard index names are not supported yet.

PRs are welcome to fix these limitations.

## License

MIT
