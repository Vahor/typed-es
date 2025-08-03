---
"@vahor/typed-es": patch
---

set type of invalid field to `unknown`

`field.keyword` now gives `field: unknown` in the output
`invalid` gives `invalid: unknown` in the output

Valid fields and nested valid fields still give the correct type
