import type { RequestedIndex } from "../lib";
import type { IsNever } from "./helpers";

type InferSource<T, Key extends string> = T extends {
	[k in Key]: (infer A)[];
}
	? A
	: never;

export type ExtractQuery_Source<
	Query extends Record<string, unknown>,
	Indexes,
	Index extends string = RequestedIndex<Query>,
	AllFields = Index extends keyof Indexes ? keyof Indexes[Index] : never,
	Source = Query["_source"],
> = Source extends readonly (infer Fields extends string)[]
	? Fields
	: Source extends {
				includes?: string[];
				include?: string[];
				excludes?: string[];
				exclude?: string[];
			}
		? Exclude<
				// TODO: check if we can do this better
					| InferSource<Source, "includes">
					| IsNever<InferSource<Source, "include">> extends true
					? AllFields
					: InferSource<Source, "includes"> | InferSource<Source, "include">,
				InferSource<Source, "excludes"> | InferSource<Source, "exclude">
			>
		: Source extends false
			? never
			: AllFields;

export type ExtractQueryFields<
	Query extends Record<string, unknown>,
	Fields = Query["fields"],
> = Fields extends readonly (infer FieldsItem extends
	| string
	| { field: string })[]
	?
			| Extract<FieldsItem, string>
			| {
					[k in Extract<FieldsItem, { field: string }>["field"]]: k;
			  }[Extract<FieldsItem, { field: string }>["field"]]
	: never;
