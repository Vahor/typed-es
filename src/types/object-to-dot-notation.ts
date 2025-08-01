import type { UnionToIntersection } from "./helpers";

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type JoinKeys<T, Prefix extends string = ""> = {
	[K in keyof T]: T[K] extends Function
		? `${Prefix}${Extract<K, string>}`
		: T[K] extends Primitive | Array<Primitive> | Date
			? `${Prefix}${Extract<K, string>}`
			:
					| `${Prefix}${Extract<K, string>}`
					| JoinKeys<T[K], `${Prefix}${Extract<K, string>}.`>;
}[keyof T];

// Inverse steps

export type RecursiveDotNotation<
	T,
	Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? RecursiveDotNotation<T[Key], Rest>
		: never
	: Path extends keyof T
		? T[Path]
		: never;

type ExpandDottedKey<
	Key extends string,
	Value,
> = Key extends `${infer K}.${infer Rest}`
	? { [P in K]: ExpandDottedKey<Rest, Value> }
	: { [P in Key]: Value };

export type ExpandAll<T> = UnionToIntersection<
	{
		[K in keyof T]: ExpandDottedKey<K & string, T[K]>;
	}[keyof T]
>;
