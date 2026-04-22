---
"@vahor/typed-es": patch
---

Add support for optional `inner_hits` inside `has_child` filters.

Result type will be `{...} | undefined` depending on whether `inner_hits` is present.
