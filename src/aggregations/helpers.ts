import type { ElasticsearchIndexes } from "../lib";

export type BucketBase = {
	doc_count: number;
};

export type KeyedBucketBase<Key = string | number> = {
	key: Key;
	doc_count: number;
};

export type UnknownKeyedBucketBase<Key = string | number> =
	KeyedBucketBase<Key> & {
		[property: string]: unknown;
	};

export type AggregationPropertyTypeResult<
	_PropertyName extends string,
	_Aggregation,
	Got,
	_Expected,
	Result,
	_Check = Got,
> = Result;

type ExtractAggregationField<Aggregation> = {
	[K in keyof Aggregation]: Aggregation[K] extends {
		field?: infer Field extends string;
	}
		? Field
		: never;
}[keyof Aggregation];

export type AggregationFieldResult<
	_E extends ElasticsearchIndexes,
	_Index extends string,
	Aggregation,
	Result,
	_Field extends string = ExtractAggregationField<Aggregation>,
> = Result;

export type AggregationFieldTypeResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	_Expected,
	Result,
	Field extends string = ExtractAggregationField<Aggregation>,
> = AggregationFieldResult<E, Index, Aggregation, Result, Field>;

export type AggregationTwoFieldTypeResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	FirstField extends string,
	_FirstExpected,
	SecondField extends string,
	_SecondExpected,
	Result,
> = AggregationFieldResult<
	E,
	Index,
	Aggregation,
	AggregationFieldResult<E, Index, Aggregation, Result, SecondField>,
	FirstField
>;
