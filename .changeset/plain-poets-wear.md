---
"@vahor/typed-es": patch
---

Improve `_source` field validation to provide better error messages. The new implementation narrows field validation to the specific index being queried, while still allowing wildcards and field variants (e.g., `.keyword`). This addresses confusing error messages that previously referenced fields from incorrect indexes.
