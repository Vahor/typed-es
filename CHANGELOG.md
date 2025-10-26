# @vahor/typed-es

## 0.0.32

### Patch Changes

- [#258](https://github.com/Vahor/typed-es/pull/258) [`2945ace`](https://github.com/Vahor/typed-es/commit/2945ace62c463cc657c930b63e4dd595f3f8f0cd) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `random_sampler` bucket aggregation with compile-time `probability` validation. The validation ensures that the `probability` parameter is greater than 0, less than 0.5, or exactly 1, catching invalid values at compile-time when using literal numbers.

- [#259](https://github.com/Vahor/typed-es/pull/259) [`ce62209`](https://github.com/Vahor/typed-es/commit/ce62209b1633b021c12f897dc85a37f074e502e7) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `bucket_sort` pipeline aggregation

- [#251](https://github.com/Vahor/typed-es/pull/251) [`4228ee3`](https://github.com/Vahor/typed-es/commit/4228ee36f8d3624d7f9ae75bf41417702c231f9b) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `categorize_text` bucket aggregation

- [#254](https://github.com/Vahor/typed-es/pull/254) [`016ecef`](https://github.com/Vahor/typed-es/commit/016ecef04c1d5742ae335479248c6635c5ac5f4b) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `geohash_grid` bucket aggregation

- [#248](https://github.com/Vahor/typed-es/pull/248) [`d6390c9`](https://github.com/Vahor/typed-es/commit/d6390c9ccaae017658975dd292804b94415b60f9) Thanks [@Vahor](https://github.com/Vahor)! - Add ctrl-click functionality on \_source fields in response

- [#256](https://github.com/Vahor/typed-es/pull/256) [`ec7f56d`](https://github.com/Vahor/typed-es/commit/ec7f56dae244a50f3fcdd6387c1698348eb1c3ae) Thanks [@Vahor](https://github.com/Vahor)! - add support for `missing` bucket aggregation

- [#261](https://github.com/Vahor/typed-es/pull/261) [`ec981c2`](https://github.com/Vahor/typed-es/commit/ec981c225442d4bcbed97f82e83804643bf8cc49) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `reverse_nested` bucket aggregation

- [#255](https://github.com/Vahor/typed-es/pull/255) [`e6bf837`](https://github.com/Vahor/typed-es/commit/e6bf8371dda2fd10871dc60210d43e8f1c66f960) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `nested` bucket aggregation

- [#257](https://github.com/Vahor/typed-es/pull/257) [`261d1ab`](https://github.com/Vahor/typed-es/commit/261d1ab2fc1e3476a1ba2d67328b77832907dba3) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `parent` bucket aggregation

- [#252](https://github.com/Vahor/typed-es/pull/252) [`da1a3aa`](https://github.com/Vahor/typed-es/commit/da1a3aa9525de9e1b2b78761d6d731cfbe14385b) Thanks [@Vahor](https://github.com/Vahor)! - feat: add support for `children` bucket aggregation

- [#253](https://github.com/Vahor/typed-es/pull/253) [`4497ab0`](https://github.com/Vahor/typed-es/commit/4497ab09c5b3d8cc7e40b8d668d3a8990dd4f7c2) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `filter` bucket aggregation

## 0.0.31

### Patch Changes

- [#211](https://github.com/Vahor/typed-es/pull/211) [`c929cb1`](https://github.com/Vahor/typed-es/commit/c929cb142f0afe3177e991131f8937a87d12cc9f) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `adjacency_matrix` bucket aggregation

- [#213](https://github.com/Vahor/typed-es/pull/213) [`7644388`](https://github.com/Vahor/typed-es/commit/7644388089ee62721445287202e70cc93e7c7301) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `auto_date_histogram` bucket aggregation.

## 0.0.30

### Patch Changes

- [#209](https://github.com/Vahor/typed-es/pull/209) [`8d63b1e`](https://github.com/Vahor/typed-es/commit/8d63b1ea7b43551522cc56c8507853b151bd4c4b) Thanks [@Vahor](https://github.com/Vahor)! - Replace `never` with `undefined` for query option results

## 0.0.29

### Patch Changes

- [`5587c62`](https://github.com/Vahor/typed-es/commit/5587c627c1b1d0eaacc6c558a2a6a4025a78b738) Thanks [@Vahor](https://github.com/Vahor)! - simplify sort check

## 0.0.28

### Patch Changes

- [#205](https://github.com/Vahor/typed-es/pull/205) [`359bbce`](https://github.com/Vahor/typed-es/commit/359bbce181ec0ce7d0eed498987978e86cb23567) Thanks [@Vahor](https://github.com/Vahor)! - Enforce type of `hits[number].sort` based on the query `sort` parameter

## 0.0.27

### Patch Changes

- [#193](https://github.com/Vahor/typed-es/pull/193) [`2c384e7`](https://github.com/Vahor/typed-es/commit/2c384e72cfb251476e62e0909370a6037fb5fbfe) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @biomejs/biome from 2.2.2 to 2.2.4

- [#195](https://github.com/Vahor/typed-es/pull/195) [`8027533`](https://github.com/Vahor/typed-es/commit/802753347b2b4fbc5e765560e129c9dd1953e949) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @changesets/cli from 2.29.6 to 2.29.7

- [#196](https://github.com/Vahor/typed-es/pull/196) [`7608fdb`](https://github.com/Vahor/typed-es/commit/7608fdbbf0fcf7cbf070ceab2914bcc8189bd8e8) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump pkg-pr-new from 0.0.57 to 0.0.60

- [#198](https://github.com/Vahor/typed-es/pull/198) [`d1dabd7`](https://github.com/Vahor/typed-es/commit/d1dabd75e1f7f16b70a2d20aed74b0381cc31132) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `significant_text` bucket aggregation

- [#199](https://github.com/Vahor/typed-es/pull/199) [`6e5d109`](https://github.com/Vahor/typed-es/commit/6e5d1098c3c43435fa478befabc4cb200998326a) Thanks [@Vahor](https://github.com/Vahor)! - add support for `sampler` bucket agg

## 0.0.26

### Patch Changes

- [#185](https://github.com/Vahor/typed-es/pull/185) [`f67bff3`](https://github.com/Vahor/typed-es/commit/f67bff333027b55bd4b5d0957b4421d0350c8289) Thanks [@Vahor](https://github.com/Vahor)! - Reduce requirements on SearchRequest type - In results if the type of any field except `_source`, `aggs`, `aggregations`, `index`, `fields`, `track_total_hits` or `rest_total_hits_as_int` is invalid or impossible to detect (any/unknown/complex union) ; the output type will still be correctly infered.

## 0.0.25

### Patch Changes

- [#164](https://github.com/Vahor/typed-es/pull/164) [`6efcd00`](https://github.com/Vahor/typed-es/commit/6efcd0065d08753baf5e39ab309e407990255cb9) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `cartesian_centroid` metric aggregation.

- [#180](https://github.com/Vahor/typed-es/pull/180) [`65eef16`](https://github.com/Vahor/typed-es/commit/65eef165490e6f72a69de46b8d22d4e4651cf11e) Thanks [@Vahor](https://github.com/Vahor)! - nullable properties result in never type in output

- [#166](https://github.com/Vahor/typed-es/pull/166) [`b8b1e75`](https://github.com/Vahor/typed-es/commit/b8b1e7543fe9f10033a1ece13968f6113e7531c4) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `variable_width_histogram` bucket aggregation.

## 0.0.24

### Patch Changes

- [#156](https://github.com/Vahor/typed-es/pull/156) [`a7dd54d`](https://github.com/Vahor/typed-es/commit/a7dd54d4fd6f620a5687b6f456786d08ef13b643) Thanks [@Vahor](https://github.com/Vahor)! - fix: parse Query passed in `asyncSearch.submit` method

## 0.0.23

### Patch Changes

- [#151](https://github.com/Vahor/typed-es/pull/151) [`05a000e`](https://github.com/Vahor/typed-es/commit/05a000ee3a2ddd9d771f1e292ecd0b50f1c6e6ff) Thanks [@Vahor](https://github.com/Vahor)! - fix: missing promise

## 0.0.22

### Patch Changes

- [#140](https://github.com/Vahor/typed-es/pull/140) [`3cd3301`](https://github.com/Vahor/typed-es/commit/3cd3301786bf20f35888292ab90e9bf140e0542b) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `rate` metric aggregation.

- [#141](https://github.com/Vahor/typed-es/pull/141) [`b9b286b`](https://github.com/Vahor/typed-es/commit/b9b286b0ce1b4c1111c2801dd40bedfaf35a5de2) Thanks [@Vahor](https://github.com/Vahor)! - Add `matrix_stats` metrics aggregation.

- [#138](https://github.com/Vahor/typed-es/pull/138) [`5f982e1`](https://github.com/Vahor/typed-es/commit/5f982e1a1514163495290da614b95cd3b08812e9) Thanks [@Vahor](https://github.com/Vahor)! - Add `weighted_avg` metric aggregation.

- [#136](https://github.com/Vahor/typed-es/pull/136) [`c40559f`](https://github.com/Vahor/typed-es/commit/c40559f9d475203ac87f371915784e285e95fc0a) Thanks [@Vahor](https://github.com/Vahor)! - Add `boxplot` metric aggregation.

- [#149](https://github.com/Vahor/typed-es/pull/149) [`f477199`](https://github.com/Vahor/typed-es/commit/f4771991e5e005089db66d738d1c7c3f98fdc601) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `asyncSearch.submit` method.

- [#148](https://github.com/Vahor/typed-es/pull/148) [`f25ed29`](https://github.com/Vahor/typed-es/commit/f25ed299a1138795404b47cb4495aac2fe9257a3) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `asyncSearch.get` method.

## 0.0.21

### Patch Changes

- [#124](https://github.com/Vahor/typed-es/pull/124) [`560feb3`](https://github.com/Vahor/typed-es/commit/560feb3f53d8df1035e30935a6e70e9ba2393a62) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `geohex_grid` bucket aggregation

- [#121](https://github.com/Vahor/typed-es/pull/121) [`d83adbc`](https://github.com/Vahor/typed-es/commit/d83adbc6b88583d184b69c9c840d5bd682a047a1) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `geotile_grid` bucket agg

- [#127](https://github.com/Vahor/typed-es/pull/127) [`76ce0c8`](https://github.com/Vahor/typed-es/commit/76ce0c8fc6aefce89be7af6a4e8857ef65bd960f) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `ip_prefix` bucket aggregation.

- [#126](https://github.com/Vahor/typed-es/pull/126) [`91c06c3`](https://github.com/Vahor/typed-es/commit/91c06c364f0e349cac4ff44c010c31c15f4c8982) Thanks [@Vahor](https://github.com/Vahor)! - Add `ip_range` bucket agg support.

## 0.0.20

### Patch Changes

- [#113](https://github.com/Vahor/typed-es/pull/113) [`e9e8f2b`](https://github.com/Vahor/typed-es/commit/e9e8f2be8483a0ccbcca8b0997de4ea36c00691f) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `median_absolute_deviation` aggregation.

- [#114](https://github.com/Vahor/typed-es/pull/114) [`b814619`](https://github.com/Vahor/typed-es/commit/b814619983789e24c371589779cb1ecb0e8455c5) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `string_stats` aggregation.

- [#111](https://github.com/Vahor/typed-es/pull/111) [`d4ca90b`](https://github.com/Vahor/typed-es/commit/d4ca90b98cbad93af9c3c6dcc5a8aea28a905eda) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `percentile_ranks` aggregation.

## 0.0.19

### Patch Changes

- [#109](https://github.com/Vahor/typed-es/pull/109) [`2e01516`](https://github.com/Vahor/typed-es/commit/2e015169bbfc562e72cfa8db69f68a2c9e215ec4) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `geo_line` aggregation

- [#110](https://github.com/Vahor/typed-es/pull/110) [`90a94dc`](https://github.com/Vahor/typed-es/commit/90a94dc8f677c8e5b190e55a7a87ddb05c6417c3) Thanks [@Vahor](https://github.com/Vahor)! - Add `percentiles` aggregations support.

- [#106](https://github.com/Vahor/typed-es/pull/106) [`0e2a57e`](https://github.com/Vahor/typed-es/commit/0e2a57e70ba1b08dfa70d3b05cd9a21093e8e874) Thanks [@Vahor](https://github.com/Vahor)! - Add support for `geo_bounds` aggregations.

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
