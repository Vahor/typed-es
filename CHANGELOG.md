# @vahor/typed-es

## 0.0.18

### Patch Changes

- [#101](https://github.com/Vahor/typed-es/pull/101) [`e3675bf`](https://github.com/Vahor/typed-es/commit/e3675bf21a9821dba8a5686a5459830919156ee1) Thanks [@Vahor](https://github.com/Vahor)! - Move `stats` aggregation in his own agg file

- [#103](https://github.com/Vahor/typed-es/pull/103) [`c342581`](https://github.com/Vahor/typed-es/commit/c3425810f994119e60bae0460f11019a5bfce3e1) Thanks [@Vahor](https://github.com/Vahor)! - Add `extended_stats` aggregation support

- [#105](https://github.com/Vahor/typed-es/pull/105) [`66189a9`](https://github.com/Vahor/typed-es/commit/66189a9d99e2b4b90322e6c1925dd8bb67f4b878) Thanks [@Vahor](https://github.com/Vahor)! - Add `geo_centroid` aggregation support.

## 0.0.17

### Patch Changes

- [#88](https://github.com/Vahor/typed-es/pull/88) [`55a87b8`](https://github.com/Vahor/typed-es/commit/55a87b881d63035302fd7f5e7275823cd0d73398) Thanks [@Vahor](https://github.com/Vahor)! - Using an invalid field in an aggregation will now cause an "error" instead of returning unknown of assuming "number".

  For example, with this index:

  ```typescript
  type Indexes = {
    index_name: {
      score: number;
    };
  };
  ```

  When requesting

  ```typescript
  {
  			aggs: {
  				min_value: {
  					min: {
  						field: "price",
  					},
  				},
  			},
  }
  ```

  You'll get:

  ```typescript
  {
  aggregations: {
      min_value: {
          message: `Field 'price' cannot be used in aggregation on 'index_name'`;
          aggregation: {
              min: {
                  field: "price",
              },
          };
      }
  }
  ```

- [#85](https://github.com/Vahor/typed-es/pull/85) [`423714f`](https://github.com/Vahor/typed-es/commit/423714fbfcd20b845c000e16b96e2c237c20fc2f) Thanks [@Vahor](https://github.com/Vahor)! - Add `unknown` types to custom fields.

  Custom object properties are not supported. This only works on leaf types.
  Example:

  ```typescript
  type Index = {
    index_name: {
      name: string;
      object: {
        nested: number;
      };
    };
  };
  ```

  With an Elasticsearch mapping like:

  ```json
  {
      "properties": {
          "name": {
              "type": "text",
              "fields": {
                  "keyword": {
                      "type": "keyword"
                  }
              }
          }
              ...
      }
  }
  ```

  You can now request

  ```typescript
  _source: [
    "name.keyword",
    "object.nested.something",
    "invalid",
    "object.variant",
  ];
  ```

  and the output will be:

  ```typescript
  { name: unknown, object: { nested: unknown} }
  ```

  As `invalid` is not a valid field, it will be ignored.
  And as `object` is an object, `variant` can't be a valid field on it. (only leaf types can have custom variants)

## 0.0.16

### Patch Changes

- [#79](https://github.com/Vahor/typed-es/pull/79) [`4d783a7`](https://github.com/Vahor/typed-es/commit/4d783a71ebeafe73c36c46be7578e66a8b20de40) Thanks [@Vahor](https://github.com/Vahor)! - Add support for the `range` aggregation

- [#84](https://github.com/Vahor/typed-es/pull/84) [`b11c57e`](https://github.com/Vahor/typed-es/commit/b11c57ee5c50b73f109cdeecfdfa7fd85b43ecf9) Thanks [@Vahor](https://github.com/Vahor)! - Add `keyed` option support on `date_histogram` aggregation

- [#81](https://github.com/Vahor/typed-es/pull/81) [`7226880`](https://github.com/Vahor/typed-es/commit/72268805a7a2320552222d08f222585198173c84) Thanks [@Vahor](https://github.com/Vahor)! - Add support for the `histogram` aggregation based on the [Elasticsearch histogram aggregation docs](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-histogram-aggregation)

- [#82](https://github.com/Vahor/typed-es/pull/82) [`38d655b`](https://github.com/Vahor/typed-es/commit/38d655bd0f38276462caa6f41532368144016f1d) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `date_range` agg based on https://elastic.co/docs/reference/aggregations/search-aggregations-bucket-daterange-aggregation

## 0.0.15

### Patch Changes

- [#75](https://github.com/Vahor/typed-es/pull/75) [`971cefb`](https://github.com/Vahor/typed-es/commit/971cefb33df88ae9ff8eba7a4ff1df5985e11440) Thanks [@Vahor](https://github.com/Vahor)! - Add `filters` aggregation based on https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-filters-aggregation.

## 0.0.14

### Patch Changes

- [#73](https://github.com/Vahor/typed-es/pull/73) [`294dc14`](https://github.com/Vahor/typed-es/commit/294dc148be9d97b65625ab871ee9d1da4cba8328) Thanks [@Vahor](https://github.com/Vahor)! - set type of invalid field to `unknown`

  `field.keyword` now gives `field: unknown` in the output
  `invalid` gives `invalid: unknown` in the output

  Valid fields and nested valid fields still give the correct type

- [#71](https://github.com/Vahor/typed-es/pull/71) [`c7db764`](https://github.com/Vahor/typed-es/commit/c7db764e215a237750979e2aad35b2b425048562) Thanks [@Vahor](https://github.com/Vahor)! - `field` and `docvalues_fields` should only return leaf types

## 0.0.13

### Patch Changes

- [#63](https://github.com/Vahor/typed-es/pull/63) [`31e63d3`](https://github.com/Vahor/typed-es/commit/31e63d3e496afaf2acf81e761859d4cbab77e454) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `top_metrics` agg

- [#61](https://github.com/Vahor/typed-es/pull/61) [`da81d18`](https://github.com/Vahor/typed-es/commit/da81d188ad1e2307dfd6a60ff02ef93c81d9af5e) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `scripted_metric` agg

## 0.0.12

### Patch Changes

- [#55](https://github.com/Vahor/typed-es/pull/55) [`2a7c602`](https://github.com/Vahor/typed-es/commit/2a7c60206854ea7a2f7daf2e1878dd3ee77f932d) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `fields` key in query

- [#56](https://github.com/Vahor/typed-es/pull/56) [`9076363`](https://github.com/Vahor/typed-es/commit/907636352de06c05716a2c3698514861892fc64e) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `docvalue_fields`

- [#49](https://github.com/Vahor/typed-es/pull/49) [`5bb7d36`](https://github.com/Vahor/typed-es/commit/5bb7d366b57561a7a00265562447ec125bbcefd2) Thanks [@Vahor](https://github.com/Vahor)! - fix `top_hits` agg output type

- [#52](https://github.com/Vahor/typed-es/pull/52) [`4f4c1b7`](https://github.com/Vahor/typed-es/commit/4f4c1b77af17d384f7ea867ffe258bd8957907e8) Thanks [@Vahor](https://github.com/Vahor)! - add `value_as_string?: string` in every agg function

## 0.0.11

### Patch Changes

- [#43](https://github.com/Vahor/typed-es/pull/43) [`72eb350`](https://github.com/Vahor/typed-es/commit/72eb3505f90529fcb32168f3e81d2d886ca7576e) Thanks [@Vahor](https://github.com/Vahor)! - Add support for generic functions in aggregations.

  Check tests in `tests/aggregations/function.test.ts` for examples.
  To make the generic function work you'll need to add `as const` in the conditional part.

- [#41](https://github.com/Vahor/typed-es/pull/41) [`fb3bfe3`](https://github.com/Vahor/typed-es/commit/fb3bfe36c74f039277eda137a42628eae58366d9) Thanks [@Vahor](https://github.com/Vahor)! - improve leaf type detection

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
