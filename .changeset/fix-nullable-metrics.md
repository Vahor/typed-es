---
"@vahor/typed-es": patch
---

Correct `avg`, `min`, and `max` values to include `null` for empty results. Consumers may need to add null checks; `sum`, `value_count`, and `cardinality` remain non-nullable.
