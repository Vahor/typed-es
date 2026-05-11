import type { RequestedIndex } from "../lib";
import type { GetField, IsNever } from "./helpers";

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

export type ExtractQuery_Source<
	Query extends Record<string, unknown>,
	Indexes,
	Index extends string = RequestedIndex<Query>,
	AllFields = Index extends keyof Indexes ? keyof Indexes[Index] : never,
	Source = Query["_source"],
> = ExtractQuerySource<Query, Indexes, Index, AllFields, Source>;

type FieldRequestName<Field> = Field extends string
	? Field
	: Field extends { field: infer Name extends string }
		? Name
		: never;

export type ExtractQueryFields<
	Query extends Record<string, unknown>,
	Fields = GetField<Query, "fields"> | GetField<Query, "docvalue_fields">,
> = Fields extends readonly (infer Field)[] ? FieldRequestName<Field> : never;
