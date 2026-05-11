import type {
	CanBeUsedInAggregation,
	ElasticsearchIndexes,
	InvalidFieldInAggregation,
	InvalidFieldTypeInAggregation,
	InvalidPropertyTypeInAggregation,
	TypeOfField,
} from "../lib";
import type { IsSomeSortOf } from "../types/helpers";

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
	PropertyName extends string,
	Aggregation,
	Got,
	Expected,
	Result,
	Check = Got,
> =
	IsSomeSortOf<Check, Expected> extends true
		? Result
		: InvalidPropertyTypeInAggregation<
				PropertyName,
				Aggregation,
				Got,
				Expected
			>;

type ExtractAggregationField<Aggregation> = {
	[K in keyof Aggregation]: Aggregation[K] extends {
		field?: infer Field extends string;
	}
		? Field
		: never;
}[keyof Aggregation];

export type AggregationFieldResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	Result,
	Field extends string = ExtractAggregationField<Aggregation>,
> =
	CanBeUsedInAggregation<Field, Index, E> extends true
		? Result
		: InvalidFieldInAggregation<Field, Index, Aggregation>;

type AggregationFieldTypeCheckResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	Field extends string,
	Expected,
	Result,
> =
	IsSomeSortOf<TypeOfField<Field, E, Index>, Expected> extends true
		? Result
		: InvalidFieldTypeInAggregation<
				Field,
				Index,
				Aggregation,
				TypeOfField<Field, E, Index>,
				Expected
			>;

export type AggregationFieldTypeResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	Expected,
	Result,
	Field extends string = ExtractAggregationField<Aggregation>,
> = AggregationFieldResult<
	E,
	Index,
	Aggregation,
	AggregationFieldTypeCheckResult<
		E,
		Index,
		Aggregation,
		Field,
		Expected,
		Result
	>,
	Field
>;

export type AggregationTwoFieldTypeResult<
	E extends ElasticsearchIndexes,
	Index extends string,
	Aggregation,
	FirstField extends string,
	FirstExpected,
	SecondField extends string,
	SecondExpected,
	Result,
> = AggregationFieldResult<
	E,
	Index,
	Aggregation,
	AggregationFieldResult<
		E,
		Index,
		Aggregation,
		AggregationFieldTypeCheckResult<
			E,
			Index,
			Aggregation,
			FirstField,
			FirstExpected,
			AggregationFieldTypeCheckResult<
				E,
				Index,
				Aggregation,
				SecondField,
				SecondExpected,
				Result
			>
		>,
		SecondField
	>,
	FirstField
>;
