# Typed ES

[![Code quality](https://github.com/vahor/typed-es/actions/workflows/quality.yml/badge.svg)](https://github.com/vahor/typed-es/actions/workflows/quality.yml)
[![npm downloads](https://img.shields.io/npm/dm/%40vahor%2Ftyped-es)](https://www.npmjs.com/package/@vahor/typed-es)
![Elasticsearch](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FVahor%2Ftyped-es%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.devDependencies.%40elastic%2Felasticsearch&logo=elasticsearch&label=Elasticsearch
)


Automatically add output types to your Elasticsearch queries.

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

const result = await (client as unknown as Client).search(myBrokenQuery); // With the `as Client` cast you are now using the native types
```

## Limitations

- query fields and aggs fields are not typed.
- Some agg functions might be missing.
- _source fields allow any string as you can use wildcards. On the other hand, wildcards will result in the **correct type** in the output.
- has to use `as unknown as TypedClient<Indexes>` which I don't like.


PRs are welcome to fix these limitations.

## License

MIT
