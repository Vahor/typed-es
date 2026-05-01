---
"@vahor/typed-es": patch
---

`typedEs` now returns `Query & Omit<estypes.SearchRequest, InferredSearchRequestFields>`, allowing the query object to be extended after creation with any standard Elasticsearch request field (e.g. `timeout`, `size`, `from`).
