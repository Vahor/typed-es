# @vahor/typed-es

## 0.0.10

### Patch Changes

- [#38](https://github.com/Vahor/typed-es/pull/38) [`8169fc9`](https://github.com/Vahor/typed-es/commit/8169fc95d3cc692910c6f78849171e91fced0bb4) Thanks [@Vahor](https://github.com/Vahor)! - add `top_hits` aggregation

## 0.0.9

### Patch Changes

- [`5868cb3`](https://github.com/Vahor/typed-es/commit/5868cb323b34b49798348beee0294e44bb983826) Thanks [@Vahor](https://github.com/Vahor)! - Add type to `after_key` and `key` in aggregation result/bucket when using composite

## 0.0.8

### Patch Changes

- [#32](https://github.com/Vahor/typed-es/pull/32) [`d591ad6`](https://github.com/Vahor/typed-es/commit/d591ad6cd4ccdb851757642fb948746d0edf693f) Thanks [@Vahor](https://github.com/Vahor)! - make aggregations field in output non nullable if present in query

## 0.0.7

### Patch Changes

- [#28](https://github.com/Vahor/typed-es/pull/28) [`fc536a0`](https://github.com/Vahor/typed-es/commit/fc536a08273c13d463846c4a7c59cbee87c52981) Thanks [@Vahor](https://github.com/Vahor)! - split files, should not cause any issues

## 0.0.6

### Patch Changes

- [#23](https://github.com/Vahor/typed-es/pull/23) [`d1ee874`](https://github.com/Vahor/typed-es/commit/d1ee8740a30018ca6a6d9ae01388b5c071cd734f) Thanks [@Vahor](https://github.com/Vahor)! - add support for nested fields

  Note: current goal is to support nested fields in `_source`, aggregations can work but not guaranteed

## 0.0.5

### Patch Changes

- [#17](https://github.com/Vahor/typed-es/pull/17) [`ddaa347`](https://github.com/Vahor/typed-es/commit/ddaa3471b236d664d4ec8d8d1e78849ad0dfb7a7) Thanks [@Vahor](https://github.com/Vahor)! - handle `rest_total_hits_as_int` option

- [#20](https://github.com/Vahor/typed-es/pull/20) [`a3e8154`](https://github.com/Vahor/typed-es/commit/a3e815424582f9b7bd067814a826a22267509a4b) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `includes` and `excludes` (and singular version) in `_source`

- [#20](https://github.com/Vahor/typed-es/pull/20) [`a3e8154`](https://github.com/Vahor/typed-es/commit/a3e815424582f9b7bd067814a826a22267509a4b) Thanks [@Vahor](https://github.com/Vahor)! - Add support for wildcards in `_source`

## 0.0.4

### Patch Changes

- [#13](https://github.com/Vahor/typed-es/pull/13) [`84d07c6`](https://github.com/Vahor/typed-es/commit/84d07c66ac5e7fd39f5d39b625bcfd09ebdee8ce) Thanks [@Vahor](https://github.com/Vahor)! - handle `aggregations` as aggregation key (previously only `aggs`)

## 0.0.3

### Patch Changes

- [#10](https://github.com/Vahor/typed-es/pull/10) [`8b7f74a`](https://github.com/Vahor/typed-es/commit/8b7f74a2f9e37ff64175ff9b748cc99bc2a1a7f2) Thanks [@Vahor](https://github.com/Vahor)! - improve types of hits.total and hits.hits[number].\_source based on the query

## 0.0.2

### Patch Changes

- [#8](https://github.com/Vahor/typed-es/pull/8) [`d2cceca`](https://github.com/Vahor/typed-es/commit/d2cceca9ca53197a2eee2b329d9828c378c50857) Thanks [@Vahor](https://github.com/Vahor)! - allow "@elastic/elasticsearch" to be v8 or v9

## 0.0.1

### Patch Changes

- [`dfe44db`](https://github.com/Vahor/typed-es/commit/dfe44dbabca27b2b3c481d1a44c1c96f8c439173) Thanks [@Vahor](https://github.com/Vahor)! - trigger changeset

- [`388735f`](https://github.com/Vahor/typed-es/commit/388735f0dd3b8dfc5ba529927317c272de4b6578) Thanks [@Vahor](https://github.com/Vahor)! - initialize project
