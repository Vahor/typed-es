---
"@vahor/typed-es": patch
---

Infer `null` in standalone `avg`, `min`, and `max` values only when the field definition explicitly includes `null`. Nullable numeric fields retain numeric `min`/`max` values without an additional `string` possibility. `sum`, `value_count`, and `cardinality` remain non-nullable. Non-nullable field definitions retain their existing result types, even though Elasticsearch can return `null` for empty results.
