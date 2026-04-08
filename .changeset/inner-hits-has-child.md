---
"@vahor/typed-es": patch
---

Add typed `inner_hits` support for `has_child` queries. The response `hit.inner_hits` is now keyed by the child `type`, or by `inner_hits.name` when specified.
