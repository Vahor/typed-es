# Msearch Support

This library now supports Elasticsearch's msearch (multi-search) API, allowing you to execute multiple search requests in a single HTTP call.

## Overview

The msearch API allows you to send multiple search requests in a single request, which is more efficient than making multiple individual search requests. The format uses newline-delimited JSON (NDJSON) where each search consists of a header and body pair.

## Types

### MultiSearchRequest
An array of search request items, where each item contains:
- `header?`: Optional header with index-specific parameters
- `body`: The search request body

### MultiSearchHeader
Optional header parameters that can override the default search behavior:
- `index`: Target index for this search
- `allow_no_indices`: Whether to allow searches on missing indices
- `expand_wildcards`: How to handle wildcard expressions
- `ignore_unavailable`: Whether to ignore unavailable indices
- And more...

### MultiSearchResponse
The response containing:
- `took`: Total time taken for all searches
- `responses`: Array of individual search responses or error responses

## Usage

### Basic Example

```typescript
import type { TypedClient } from "typed-es";

type MyIndexes = {
  users: {
    id: string;
    name: string;
    email: string;
  };
  posts: {
    id: string;
    title: string;
    content: string;
  };
};

const client: TypedClient<MyIndexes> = /* your elasticsearch client */;

// Perform multiple searches
const result = await client.msearch({
  searches: [
    {
      header: { index: "users" },
      body: {
        query: { match: { name: "John" } },
        _source: ["id", "name"]
      }
    },
    {
      header: { index: "posts" },
      body: {
        query: { match: { title: "Hello" } },
        _source: ["id", "title"]
      }
    }
  ]
});

// Handle responses
result.responses.forEach((response, index) => {
  if ('hits' in response) {
    console.log(`Search ${index + 1} found ${response.hits.total} results`);
  } else {
    console.log(`Search ${index + 1} failed:`, response.error);
  }
});
```

### Without Headers

You can also specify the index in the search body instead of using headers:

```typescript
const result = await client.msearch({
  searches: [
    {
      body: {
        index: "users",
        query: { match: { name: "John" } },
        _source: ["id", "name"]
      }
    },
    {
      body: {
        index: "posts",
        query: { match: { title: "Hello" } },
        _source: ["id", "title"]
      }
    }
  ]
});
```

### With Options

You can pass additional msearch options:

```typescript
const result = await client.msearch({
  searches: [
    // ... your searches
  ],
  allow_no_indices: true,
  ignore_unavailable: true,
  max_concurrent_searches: 5
});
```

## Available Options

- `allow_no_indices`: Allow searches on missing indices
- `ccs_minimize_roundtrips`: Minimize network roundtrips for cross-cluster searches
- `expand_wildcards`: Control wildcard expression matching
- `ignore_throttled`: Ignore frozen indices
- `ignore_unavailable`: Ignore unavailable indices
- `include_named_queries_score`: Include named query scores in results
- `max_concurrent_searches`: Maximum concurrent searches
- `max_concurrent_shard_requests`: Maximum concurrent shard requests per search
- `pre_filter_shard_size`: Threshold for pre-filtering shards
- `rest_total_hits_as_int`: Return total hits as integer
- `routing`: Custom routing value
- `search_type`: Search execution strategy
- `typed_keys`: Prefix aggregation names with types

## Type Safety

The msearch implementation provides full TypeScript type safety:

- Request validation based on your index definitions
- Response typing that matches your search queries
- Proper handling of both successful and error responses
- Field-level type checking for `_source`, `fields`, and aggregations

## Benefits

1. **Performance**: Execute multiple searches in a single HTTP request
2. **Efficiency**: Reduce network overhead and latency
3. **Atomicity**: All searches are processed together
4. **Type Safety**: Full TypeScript support with your existing index definitions
5. **Flexibility**: Mix different search types and indices in one request

## Limitations

- Maximum request size limits apply
- All searches must complete before any results are returned
- Error handling is per-search (one failed search doesn't affect others)
- Response ordering matches request ordering 