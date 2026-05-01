---
"@vahor/typed-es": patch
---

`TypedSearchRequest` now includes all standard Elasticsearch request fields (e.g. `timeout`, `size`, `from`), providing autocomplete for any field not overwritten by typed-es. `typedEs` also widens its return type accordingly, so those fields can be assigned after creation.
