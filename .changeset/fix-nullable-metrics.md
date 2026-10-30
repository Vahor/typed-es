---
"@vahor/typed-es": major
---

Correct standalone `avg`, `min`, and `max` values to include `null` for empty results. Breaking type change: consumers must handle `null` before using number-only operations. Nullable numeric fields retain numeric `min`/`max` values without an additional `string` possibility. `sum`, `value_count`, and `cardinality` remain non-nullable.
