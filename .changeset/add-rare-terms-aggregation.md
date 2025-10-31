---
"@vahor/typed-es": patch
---

Added support for the Rare Terms aggregation.

This implementation follows the Elasticsearch documentation and includes:
- Type-safe definition for Rare Terms aggregation
- Support for all parameters (field, max_doc_count, precision, include, exclude, missing)
- Proper type inference for bucket keys based on field type
- Integration with existing aggregation system
- Comprehensive tests covering basic usage and error cases