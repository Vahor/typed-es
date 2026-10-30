import type { RequestedIndex } from "../lib";
import type { GetField, IsNever } from "./helpers";
import type { DotNotationLeaf } from "./object-to-dot-notation";
import type { WildcardSearch } from "./wildcard-search";

type SourceFilterKey = "includes" | "include" | "excludes" | "exclude";
type SourceFilter = Partial<Record<SourceFilterKey, readonly string[]>>;

type SourceFilterValue<T, Key extends SourceFilterKey> = Key extends string
	? T extends { [K in Key]: readonly (infer Field extends string)[] }
		? Field
		: never
	: never;

type SourceIncludeFields<Source, AllFields> =
	IsNever<SourceFilterValue<Source, "includes" | "include">> extends true
		? AllFields
		: SourceFilterValue<Source, "includes" | "include">;

export type ExtractQuerySource<
	Query extends Record<string, unknown>,
	Indexes,
	Index extends string = RequestedIndex<Query>,
	AllFields = Index extends keyof Indexes ? keyof Indexes[Index] : never,
	Source = Query["_source"],
> = Source extends readonly (infer Fields extends string)[]
	? Fields
	: Source extends SourceFilter
		? Exclude<
				SourceIncludeFields<Source, AllFields>,
				SourceFilterValue<Source, "excludes" | "exclude">
			>
		: Source extends false
			? never
			: AllFields;

// Exclude fields before picking them so an included parent cannot restore excluded children.
type ExcludeSourceFields<
	Source,
	Excludes,
	Prefix extends string = "",
> = Source extends DotNotationLeaf
	? Source
	: Source extends readonly unknown[]
		? {
				[K in keyof Source]: ExcludeSourceFields<Source[K], Excludes, Prefix>;
			}
		: {
				[K in keyof Source as IsNever<
					WildcardSearch<`${Prefix}${Extract<K, string>}`, Excludes>
				> extends true
					? K
					: never]: ExcludeSourceFields<
					Source[K],
					Excludes,
					`${Prefix}${Extract<K, string>}.`
				>;
			};

export type ExcludeQuerySource<Query, Source> = Query extends {
	_source: infer Filter extends
		| { excludes: readonly string[] }
		| { exclude: readonly string[] };
}
	? ExcludeSourceFields<
			Source,
			SourceFilterValue<Filter, "excludes" | "exclude">
		>
	: Source;

type FieldRequestName<Field> = Field extends string
	? Field
	: Field extends { field: infer Name extends string }
		? Name
		: never;

export type ExtractQueryFields<
	Query extends Record<string, unknown>,
	Fields = GetField<Query, "fields"> | GetField<Query, "docvalue_fields">,
> = Fields extends readonly (infer Field)[] ? FieldRequestName<Field> : never;
