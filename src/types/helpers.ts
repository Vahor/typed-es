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
