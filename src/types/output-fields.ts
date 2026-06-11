import type { ArrayItem, UnionToIntersection } from "./helpers";
import type {
	Primitive,
	RecursiveDotNotation,
	RemoveLastDot,
} from "./object-to-dot-notation";

type ObjectArrayElement<T> =
	NonNullable<T> extends ReadonlyArray<infer Item>
		? NonNullable<Item> extends Primitive | Date | Function
			? never
			: NonNullable<Item>
		: never;

type ClosestObjectArrayPath<
	Schema,
	Field extends string,
	Parent = RemoveLastDot<Field>,
> = Field extends Parent
	? never
	: Parent extends string
		? [ObjectArrayElement<RecursiveDotNotation<Schema, Parent>>] extends [never]
			? ClosestObjectArrayPath<Schema, Parent>
			: Parent
		: never;

type FieldObjectAtPath<
	T,
	Path extends string,
	Value,
> = Path extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? [ObjectArrayElement<T[Key]>] extends [never]
			? { [K in Key]: FieldObjectAtPath<ArrayItem<T[Key]>, Rest, Value> }
			: {
					[K in Key]: Array<
						FieldObjectAtPath<ObjectArrayElement<T[Key]>, Rest, Value>
					>;
				}
		: {}
	: Path extends keyof T
		? { [K in Path]: Value }
		: {};

export type FieldsOutputForSchema<
	Schema,
	Field extends string,
	Value,
	Parent extends string = Extract<
		ClosestObjectArrayPath<Schema, Field>,
		string
	>,
> = [Parent] extends [never]
	? Record<Field, Value>
	: Field extends `${Parent}.${infer Rest}`
		? {
				[K in Parent]: Array<
					FieldObjectAtPath<
						ArrayItem<RecursiveDotNotation<Schema, Parent>>,
						Rest,
						Value
					>
				>;
			}
		: Record<Field, Value>;

type ValueOfUnion<T, Key extends PropertyKey> =
	T extends Record<Key, infer Value> ? Value : never;

type MergeFieldValue<Value> = [Value] extends [ReadonlyArray<unknown>]
	? [ArrayItem<Value>] extends [object]
		? Array<UnionToIntersection<ArrayItem<Value>>>
		: Value
	: Value;

export type MergeFieldsOutputEntries<Output> = {
	[K in Output extends unknown ? keyof Output : never]: MergeFieldValue<
		ValueOfUnion<Output, K>
	>;
};
