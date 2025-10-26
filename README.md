# Typed ES

[![Code quality](https://github.com/vahor/typed-es/actions/workflows/quality.yml/badge.svg)](https://github.com/vahor/typed-es/actions/workflows/quality.yml)
[![npm downloads](https://img.shields.io/npm/dm/%40vahor%2Ftyped-es)](https://www.npmjs.com/package/@vahor/typed-es)
![Elasticsearch](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FVahor%2Ftyped-es%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.devDependencies.%40elastic%2Felasticsearch&logo=elasticsearch&label=Elasticsearch
)


Automatically add output types to your Elasticsearch queries.

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
| Diversified Sampler | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-diversified-sampler-aggregation) |
| Filter | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filter-aggregation) |
| Filters | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation) |
| Frequent Item Sets | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-frequent-item-sets-aggregation) |
| Geohash Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohashgrid-aggregation) |
| Geohex Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geohexgrid-aggregation) |
| Geotile Grid | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-geotilegrid-aggregation) |
| Global | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-global-aggregation) |
| Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-histogram-aggregation) |
| IP Prefix | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-ipprefix-aggregation) |
| IP Range | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-iprange-aggregation) |
| Missing | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-missing-aggregation) |
| Multi Terms | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-multi-terms-aggregation) |
| Parent | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-parent-aggregation) |
| Nested | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-nested-aggregation) |
| Random Sampler | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-random-sampler-aggregation) |
| Range | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-range-aggregation) |
| Rare Terms | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-rare-terms-aggregation) |
| Reverse Nested | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-reverse-nested-aggregation) |
| Sampler | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-sampler-aggregation) |
| Significant Terms | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation) |
| Significant Text | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significanttext-aggregation) |
| Terms | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-terms-aggregation) |
| Time Series | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-time-series-aggregation) |
| Variable Width Histogram | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-variablewidthhistogram-aggregation) |

### Metrics Aggregations
| Aggregation | Status | Documentation |
|-------------|--------|---------------|
| Avg | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-avg-aggregation) |
| Boxplot | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-boxplot-aggregation) |
| Cardinality | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cardinality-aggregation) |
| Cartesian Bounds | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-cartesian-bounds-aggregation) |
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
| T-Test | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-ttest-aggregation) |
| Top Hits | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-hits-aggregation) |
| Top Metrics | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-top-metrics) |
| Value Count | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-valuecount-aggregation) |
| Weighted Avg | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-metrics-weight-avg-aggregation) |

### Pipeline Aggregations
| Aggregation | Status | Documentation |
|-------------|--------|---------------|
| Average Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-avg-bucket-aggregation) |
| Bucket Script | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-script-aggregation) |
| Bucket Count K-S Test | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-count-ks-test-aggregation) |
| Bucket Correlation | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-correlation-aggregation) |
| Bucket Selector | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-selector-aggregation) |
| Bucket Sort | ✅ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-bucket-sort-aggregation) |
| Change Point | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-change-point-aggregation) |
| Cumulative Cardinality | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-cardinality-aggregation) |
| Cumulative Sum | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-cumulative-sum-aggregation) |
| Derivative | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-derivative-aggregation) |
| Extended Stats Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-extended-stats-bucket-aggregation) |
| Inference | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-inference-bucket-aggregation) |
| Max Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-max-bucket-aggregation) |
| Min Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-min-bucket-aggregation) |
| Moving Average | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-movfn-aggregation) |
| Moving Function | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-movfn-aggregation) |
| Moving Percentiles | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-moving-percentiles-aggregation) |
| Normalize | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-normalize-aggregation) |
| Percentiles Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-percentiles-bucket-aggregation) |
| Serial Differencing | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-serialdiff-aggregation) |
| Stats Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-stats-bucket-aggregation) |
| Sum Bucket | ❌ | [docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-pipeline-sum-bucket-aggregation) |

</details>

## Features
- **Automatic type based on options**: Automatically infers output types from query options (e.g., returning `total` count).  
- **Automatic output type based on requested fields and aggregations**: Derives precise types from specified `_source`, `fields`, `docvalue_fields` and `aggregations` configurations.  
- **Understand wildcards**: The library correctly detects and infers output types even when using wildcards in `_source`.  
  For example, given an index with fields `{ created_at: string; title: string }`,  
  specifying `_source: ["*_at"]` will correctly return `{ created_at: string }` in the output type.  
- **Supports `search` and [`asyncSearch`](#usage-with-asyncsearch)**: You can still use the native types if something goes wrong (see [What if the library is missing a feature that you need?](#what-if-the-library-is-missing-a-feature-that-you-need)).

## Example Usage
```ts
type MyIndex = {
   "my-index": {
      id: number;
      name: string;
      created_at: string;
   }
};

// Having to use `as unknown` is less than ideal, but as we're overriding types, typescript isn't very happy
const client = new Client({/* config */}) as unknown as TypedClient<Indexes>;

// Query with _source (wildcard), fields, aggregation, and options
const query = typedEs(client, {
	index: "my-index",
	_source: ["id", "na*"],
	fields: [
		{
			field: "created_at",
			format: "yyyy-MM-dd",
		},
	],
	track_total_hits: true,
	rest_total_hits_as_int: true, // Ensures total value is returned as a number
	aggs: {
		name_counts: { terms: { field: "name" } },
	},
});

const result = await client.search(query);
const total = result.hits.total; // number
const firstHit = result.hits.hits[0]; // { _source: { id: number; name: string}, fields: { created_at: string[] } }
const aggregationBuckets = result.aggregations.name_counts.buckets; // Array<{ key: string | number; doc_count: number; }>
```

## Why This Library?
To highlight the benefits, here's a comparison with/without the library:

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

## Install

```bash
bun add @vahor/typed-es
```

Note: you can install it in dev-dependencies if you don't plan to use the `typedEs` function.

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
import { TypedClient } from "@vahor/typed-es";

const client = new Client({
    ... // elasticsearch client config
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

`typedEs` is a simple wrapper that adds type safety to index, autocompletes on _source. 
Check its definition in [typed-es.ts](./src/typed-es.ts), you can reuse the same definition to add default values to your queries.

Note: when `_source` is missing, the output will contain every fields.

### Step 4: Enjoy an easy type-safe output

```ts
// Use the elasticsearch client as usual
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

The [asyncSearch](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-async-search-get) API has some complexity for us. The `get` method does not include the original query type information by default.
To work around that we've added a new type definition.

```typescript
const query = typedEs(...);

const result = await client.asyncSearch.get<typeof query>({ id: "abc" });
const data = result.response; // Same type as if you used client.search(query);

// If you don't have a query variable, you can pass the query type explicitly.
const result = await client.asyncSearch.get<{ query: ...}>({ id: "abc" });
```

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

- query fields and aggs fields are not typed.
- Some agg functions might be missing.
- _source fields allow any string as you can use wildcards. On the other hand, wildcards will result in the **correct type** in the output.
- has to use `as unknown as TypedClient<Indexes>` which I don't like.


PRs are welcome to fix these limitations.

## License

MIT
