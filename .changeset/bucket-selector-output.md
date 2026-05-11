---
"@vahor/typed-es": patch
---

Export the `bucket_selector` pipeline aggregation output type, which correctly resolves to no response entry because `bucket_selector` only filters parent buckets.
