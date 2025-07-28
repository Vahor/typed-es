# Typed ES

[![Code quality](https://github.com/vahor/typed-es/actions/workflows/quality.yml/badge.svg)](https://github.com/vahor/typed-es/actions/workflows/quality.yml)
[![npm downloads](https://img.shields.io/npm/dm/%40vahor%2Ftyped-es)](https://www.npmjs.com/package/@vahor/typed-es)


## Features
- **Wildcard support**: Allows the use of wildcards in the `_source` field to flexibly specify the fields to be returned.
- **Automatic type based on options**: Automatically determines the output types based on query options, such as returning the `total` count.
- **Automatic output type based on `_source` and aggregations**: Infers the correct output types according to the `_source` field and aggregations in the query.

Automatically add output types to your Elasticsearch queries.

## Install

```bash
bun add -D @vahor/typed-es
```

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

const client: TypedClient<CustomIndexes> = new Client({
    ...
});
```

### Step 3: Use the typedEs function

```ts
import { typedEs } from "@vahor/typed-es";

const query = typedEs(client, {
    index: "first-index",
    _source: ["score", "entity_id", "*ate"],
});

// typedEs is a simple wrapper, this is equivalent to:
const query = {
    index: "first-index",
    _source: ["score", "entity_id", "*ate"],
} as const satisfies SearchRequest;

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


const outoutWithAggs = await client.search(queryWithAggs);
const aggs = outputWithAggs.aggregations;
const someAgg = aggs.some_agg;
const someAggTerms = someAgg.buckets;
for (const bucket of someAggTerms) {
    // Here bucket is typed as { key: string; doc_count: number }
    const key = bucket.key; // typed as string
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


## Limitations

- query fields and aggs fields are not typed.
- Some agg functions might be missing.
- _source fields allow any string as you can use wildcards. On the other hand, wildcards will result in the **correct type** in the output.


PRs are welcome to fix these limitations.

## License

MIT
