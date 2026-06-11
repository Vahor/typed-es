import type { ArrayItem } from "./helpers";

export type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined;

export type JoinKeys<T, OnlyLeaf = false, Prefix extends string = ""> = {
	[K in keyof T]: NonNullable<T[K]> extends Function
		? `${Prefix}${Extract<K, string>}`
		: NonNullable<T[K]> extends Primitive | ReadonlyArray<Primitive> | Date
			? `${Prefix}${Extract<K, string>}`
			:
					| (OnlyLeaf extends true ? never : `${Prefix}${Extract<K, string>}`)
					| JoinKeys<
							ArrayItem<T[K]>,
							OnlyLeaf,
							`${Prefix}${Extract<K, string>}.`
					  >;
}[keyof T];

// Inverse steps

export type RecursiveDotNotation<
	T,
	Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? RecursiveDotNotation<ArrayItem<T[Key]>, Rest>
		: never
	: Path extends keyof T
		? T[Path]
		: never;

export type FLAT_UNKNOWN = "FLAT_UNKNOWN";

export type RemoveLastDot<T> = T extends `${infer Prefix}.${infer Rest}`
	? Rest extends `${string}.${string}`
		? `${Prefix}.${RemoveLastDot<Rest>}`
		: Prefix
	: T;
