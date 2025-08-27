---
"@vahor/typed-es": patch
---

Reduce requirements on SearchRequest type - In results if the type of any field except `_source`, `aggs`, `aggregations`, `index`, `fields`, `track_total_hits` or `rest_total_hits_as_int` is invalid or impossible to detect (any/unknown/complex union) ; the output type will still be correctly infered.
