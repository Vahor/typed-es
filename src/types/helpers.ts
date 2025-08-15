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

export type IsStringLiteral<T> = T extends string
	? string extends T
		? false // it's just "string"
		: true // it's a literal
	: false;

export type AnyString = string & {};

export type OrLowercase<T extends string> = Lowercase<T> | T;

export type ToString<T> = T extends string | number | boolean | undefined | null
	? `${T}`
	: T extends Function
		? "function"
		: T extends Array<any>
			? `Array`
			: T extends object
				? "object"
				: T extends any
					? "any"
					: "unknown";

export type IsSomeSortOf<T, U> = T extends U
	? true
	: U extends T
		? true
		: false;

export type ToDecimal<N> = IsFloatLiteral<N> extends true
	? ToString<N>
	: IsNumericLiteral<N> extends true
		? `${ToString<N>}.0`
		: never;

export type Enumerate<T extends number, Acc extends number[] = []> = T extends 0
	? Acc
	: Acc["length"] extends T
		? Acc[number]
		: Enumerate<T, [...Acc, Acc["length"]]>;

export type RangeInclusive<T extends number, U extends number> =
	| U
	| Exclude<Enumerate<U>, Enumerate<T>>;

export type AtLeastOneOf<
	T,
	Keys extends keyof T = keyof T,
> = Keys extends unknown
	? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
	: never;

export type Ipv4 = `${number}.${number}.${number}.${number}`;
export type CidrIpv4<T extends number = number> = `${Ipv4}/${T}`;
export type Ipv6 = string;
export type CidrIpv6<T extends number = number> = `${Ipv6}/${T}`;

export type KeyedArrayToObject<O> = O extends readonly { key: string }[]
	? {
			[K in O[number] as K["key"]]: Omit<K, "key">;
		}
	: never;

export type And<A, B> = A extends true
	? B extends true
		? true
		: false
	: false;

export type Not<A> = A extends true ? false : true;
