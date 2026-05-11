import type {
	ElasticsearchIndexes,
	PossibleFields,
	RequestedIndex,
} from "../lib";
import type { IsNever, IsStringLiteral } from "./helpers";
import type { WildcardSearch } from "./wildcard-search";

export type InvalidSourceField<
	Field extends string,
	Index extends string,
> = Field & {
	readonly "~error": `\`${Field}\` is not a valid field for index \`${Index}\``;
};

type ValidSourceFieldVariant<
	Index extends string,
	Indexes extends ElasticsearchIndexes,
> = `${PossibleFields<Index, Indexes, true>}.${string}`;

type ValidateSourceField<
	Field,
	Index extends string,
	Indexes extends ElasticsearchIndexes,
> = Field extends string
	? IsStringLiteral<Field> extends false
		? Field
		: Field extends PossibleFields<Index, Indexes, false, true>
			? Field
			: Field extends ValidSourceFieldVariant<Index, Indexes>
				? Field
				: Field extends `${string}*${string}`
					? IsNever<
							WildcardSearch<PossibleFields<Index, Indexes>, Field>
						> extends true
						? InvalidSourceField<Field, Index>
						: Field
					: InvalidSourceField<Field, Index>
	: Field;

type ValidateSourceFieldList<
	Fields,
	Index extends string,
	Indexes extends ElasticsearchIndexes,
> = Fields extends readonly unknown[]
	? {
			[K in keyof Fields]: K extends number | `${number}`
				? ValidateSourceField<Fields[K], Index, Indexes>
				: Fields[K];
		}
	: Fields;

type ValidateSourceObject<
	Source,
	Index extends string,
	Indexes extends ElasticsearchIndexes,
> = {
	[K in keyof Source]: K extends "includes" | "include" | "excludes" | "exclude"
		? ValidateSourceFieldList<Source[K], Index, Indexes>
		: Source[K];
};

type ValidateSource<
	Source,
	Index extends string,
	Indexes extends ElasticsearchIndexes,
> = Source extends false
	? Source
	: Source extends readonly unknown[]
		? ValidateSourceFieldList<Source, Index, Indexes>
		: Source extends object
			? ValidateSourceObject<Source, Index, Indexes>
			: Source;

export type ValidateTypedSearchRequest<
	Indexes extends ElasticsearchIndexes,
	Query,
> = Query extends { _source: infer Source }
	? {
			_source: ValidateSource<
				Source,
				Extract<RequestedIndex<Query>, string>,
				Indexes
			>;
		}
	: unknown;
