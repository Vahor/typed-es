---
"@vahor/typed-es": patch
---

Validate literal `_source` fields in `typedEs`, so invalid fields now report the selected `index` instead of unrelated index fields while preserving wildcard and dynamic string support.
