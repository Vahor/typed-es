export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type PrettyArray<T> = Array<Prettify<T>>;

export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? Prettify<I>
	: never;

export type IsNever<T> = [T] extends [never] ? true : false;

export type GetField<
	T extends Record<string, unknown>,
	Key extends string,
> = Key extends keyof T ? T[Key] : never;

export type IsNumericLiteral<T> = T extends number
	? number extends T
		? false // it's just "number"
		: true // it's a literal
	: false;

export type IsFloatLiteral<T> = IsNumericLiteral<T> extends true
	? T extends number // only here to make type narrowing work
		? `${T}` extends `${string}.${string}`
			? true
			: false
		: false
	: false;

export type AnyString = string & {};
