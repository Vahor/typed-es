---
"@vahor/typed-es": patch
---

Add support for generic function in aggregations.

Check tests in `tests/aggregations/function.test.ts` for examples.
To make the generic function work you'll need to add `as const` in the conditional part.
