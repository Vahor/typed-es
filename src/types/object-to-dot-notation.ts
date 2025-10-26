export type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined;

export type JoinKeys<T, OnlyLeaf = false, Prefix extends string = ""> = {
	[K in keyof T]: T[K] extends Function
		? `${Prefix}${Extract<K, string>}`
		: T[K] extends Primitive | Array<Primitive> | Date
			? `${Prefix}${Extract<K, string>}`
			:
					| (OnlyLeaf extends true ? never : `${Prefix}${Extract<K, string>}`)
					| JoinKeys<T[K], OnlyLeaf, `${Prefix}${Extract<K, string>}.`>;
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

export type FLAT_UNKNOWN = "FLAT_UNKNOWN";

export type RemoveLastDot<T> = T extends `${infer Prefix}.${infer Rest}`
	? Rest extends `${string}.${string}`
		? `${Prefix}.${RemoveLastDot<Rest>}`
		: Prefix
	: T;
