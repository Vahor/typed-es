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
