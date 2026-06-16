---
"@vahor/typed-es": patch
---

Fix fields output type for array-typed schema fields (e.g. `Date[]`) being double-wrapped into `Date[][]` instead of `Date[]`
