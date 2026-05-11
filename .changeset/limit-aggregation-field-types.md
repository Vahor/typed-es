---
"@vahor/typed-es": patch
---

Add field-type validation to `extended_stats`, `histogram`, `range`, `auto_date_histogram`, `date_histogram`, and `date_range`, so incompatible fields now return `InvalidFieldTypeInAggregation`.
