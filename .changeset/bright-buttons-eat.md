---
"@vahor/typed-es": patch
---

Add support for `random_sampler` bucket aggregation with compile-time `probability` validation. The validation ensures that the `probability` parameter is greater than 0, less than 0.5, or exactly 1, catching invalid values at compile-time when using literal numbers.
